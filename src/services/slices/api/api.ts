import { baseQueryWithRefresh } from '@/utils/api';
import { createApi } from '@reduxjs/toolkit/query/react';

import type { TUniqIngredient } from '../burger-constructor/burger-constructor-slice';
import type { TIngredient } from '@/utils/types';

type SubmitOrderResponse = {
  name: string;
  order: { number: number };
  number: number;
  success: boolean;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh({
    baseUrl: 'https://new-stellarburgers.education-services.ru/api/',
  }),
  endpoints: (build) => ({
    getIngredients: build.query<{ data: TIngredient[]; success: boolean }, void>({
      query: () => {
        return {
          url: `ingredients`,
          method: 'GET',
        };
      },
    }),

    submitOrder: build.mutation<SubmitOrderResponse, TUniqIngredient[]>({
      query: (ingredients) => {
        return {
          url: 'orders',
          method: 'POST',
          body: {
            ingredients: ingredients.map((item) => item._id),
            authorization: localStorage.getItem('accessToken'),
          },
        };
      },
    }),
  }),
});

export const { useGetIngredientsQuery, useSubmitOrderMutation } = rootApi;
