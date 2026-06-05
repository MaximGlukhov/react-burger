import { fetchWithRefresh } from '@utils/token';

import type { BaseQueryFn } from '@reduxjs/toolkit/query';

type TBaseQueryConfig = {
  baseUrl: string;
};

type TBaseQueryArgs = {
  url: string;
  method?: string;
  body?: BodyInit | Record<string, unknown> | null;
  params?: Record<string, string>;
  headers?: Record<string, string>;
};

type TBaseQueryError = {
  status: number;
  data?: unknown;
  message?: string;
};

export const baseQueryWithRefresh =
  ({
    baseUrl,
  }: TBaseQueryConfig): BaseQueryFn<TBaseQueryArgs, unknown, TBaseQueryError> =>
  async (args, _api, _extraOptions) => {
    try {
      const {
        url,
        method = 'GET',
        body,
        params,
        headers: customHeaders,
        ...rest
      } = args;

      const fullUrl = new URL(url, baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          fullUrl.searchParams.append(key, value);
        });
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      const options: RequestInit = {
        method,
        headers,
        ...rest,
        ...(body !== undefined && {
          body:
            typeof body === 'string' || body instanceof FormData
              ? body
              : JSON.stringify(body),
        }),
      };

      const data = await fetchWithRefresh(fullUrl.href, options);

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('token') || errorMessage.includes('401')) {
        return {
          error: {
            status: 401,
            message: 'Authentication failed',
            data: errorMessage,
          },
        };
      }

      return {
        error: {
          status: 500,
          message: errorMessage,
          data: error,
        },
      };
    }
  };
