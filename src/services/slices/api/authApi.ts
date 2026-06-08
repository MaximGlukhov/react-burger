import { baseQueryWithRefresh } from '@/utils/api';
import { createApi } from '@reduxjs/toolkit/query/react';

import { setUser } from '../user/user';

type TLoginCredentials = {
  email: string;
  password: string;
};

type TRegisterCredentials = {
  email: string;
  password: string;
  name: string;
};

type TUser = {
  email: string;
  name: string;
};

type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

type TLogoutResponse = {
  success: boolean;
  message: string;
};

type TForgotPassword = {
  success: true;
  message: 'Reset email sent';
};

type TResetPassword = { password: string; token: string };

type TGetUser = {
  success: true;
  user: TUser;
};

type TRefreshResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRefresh({
    baseUrl: 'https://new-stellarburgers.education-services.ru/api/',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<TUser, TLoginCredentials>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: TAuthResponse): TUser => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      },
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        await queryFulfilled.then((res) => {
          dispatch(setUser(res.data));
        });
      },
    }),

    register: builder.mutation<TUser, TRegisterCredentials>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: TAuthResponse): TUser => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return response.user;
      },

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        await queryFulfilled.then((res) => {
          dispatch(setUser(res.data));
        });
      },
    }),

    logout: builder.mutation<TLogoutResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
      }),
      transformResponse: (res: TLogoutResponse) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return res;
      },

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        await queryFulfilled.then(() => {
          dispatch(setUser(null));
        });
      },
    }),

    forgotPasswort: builder.mutation<TForgotPassword, string>({
      query: (email: string) => ({
        url: 'password-reset',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),

    resetPassword: builder.mutation<void, TResetPassword>({
      query: (data) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body: data,
      }),
    }),

    getUser: builder.query<TUser, void>({
      query: () => ({
        url: 'auth/user',
        method: 'GET',
      }),
      transformResponse: (response: TGetUser): TUser => response.user,

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        await queryFulfilled.then((res) => {
          dispatch(setUser(res.data));
        });
      },
    }),

    refreshToken: builder.mutation<TRefreshResponse, { token: string }>({
      query: () => ({
        url: 'auth/token',
        method: 'POST',
        body: {
          token: localStorage.getItem('refreshToken'),
        },
      }),
      transformResponse: (response: TRefreshResponse): TRefreshResponse => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response;
      },
    }),

    updateUser: builder.mutation<TUser, TRegisterCredentials>({
      query: (user) => ({
        url: 'auth/user',
        method: 'PATCH',
        body: user,
      }),

      transformResponse: (res: TGetUser): TUser => {
        return res.user;
      },

      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        await queryFulfilled.then((res) => {
          dispatch(setUser(res.data));
        });
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswortMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = authApi;
