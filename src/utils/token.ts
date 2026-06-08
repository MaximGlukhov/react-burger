export type TFetchError = Error & {
  statusCode: number;
  data?: unknown;
};

type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type TQueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedQueue: TQueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    const error = new Error('No refresh token available') as TFetchError;
    error.statusCode = 401;
    throw error;
  }

  const response = await fetch(
    'https://new-stellarburgers.education-services.ru/api/auth/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
    }
  );

  if (!response.ok) {
    const error = new Error('Failed to refresh token') as TFetchError;
    error.statusCode = response.status;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    throw error;
  }

  const data: TRefreshResponse = (await response.json()) as TRefreshResponse;

  if (data.success && data.accessToken && data.refreshToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  }

  const error = new Error('Invalid refresh token response') as TFetchError;
  error.statusCode = 500;
  throw error;
};

const makeAuthenticatedRequest = async (
  endpoint: string,
  options: RequestInit,
  token: string | null
): Promise<Response> => {
  const headers = new Headers(options.headers);

  if (token) {
    const cleanToken = token.replace('Bearer ', '');
    headers.set('Authorization', `Bearer ${cleanToken}`);
  }

  return fetch(endpoint, {
    ...options,
    headers,
  });
};

export async function fetchWithRefresh<T = unknown>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const makeRequest = async (token: string | null): Promise<T> => {
    const response = await makeAuthenticatedRequest(endpoint, options, token);

    if (!response.ok) {
      const error = new Error(response.statusText) as TFetchError;
      error.statusCode = response.status;

      try {
        error.data = await response.json();
      } catch {
        throw error;
      }

      throw error;
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  };

  try {
    const currentToken = localStorage.getItem('accessToken');
    return await makeRequest(currentToken);
  } catch (error) {
    const fetchError = error as TFetchError;

    const shouldRefreshToken =
      (fetchError.statusCode === 401 || fetchError.statusCode === 403) &&
      Boolean(localStorage.getItem('refreshToken'));

    if (!shouldRefreshToken) {
      throw error;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => makeRequest(newToken as string))
        .catch((err) => {
          throw err;
        });
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      return await makeRequest(newToken);
    } catch (refreshError) {
      processQueue(refreshError as Error, null);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:logout', {
            detail: { error: refreshError },
          })
        );
      }

      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
}
