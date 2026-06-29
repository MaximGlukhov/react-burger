import { baseQueryWithRefresh } from '@/utils/api';
import { BASE_URL } from '@/utils/const';
import { createApi } from '@reduxjs/toolkit/query/react';

import type { TUniqIngredient } from '../burger-constructor/burger-constructor-slice';
import type { TIngredient, TOrder } from '@/utils/types';

type SubmitOrderResponse = {
  name: string;
  order: { number: number };
  number: number;
  success: boolean;
};

type OrderMessage = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

let socket: WebSocket | null = null;

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh({
    baseUrl: BASE_URL,
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

    getOrders: build.query<OrderMessage, void>({
      query: () => {
        return { url: 'orders/all' };
      },

      async onCacheEntryAdded(_arg, api) {
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let isActive = true;

        const connect = (): void => {
          if (!isActive) return;

          socket = new WebSocket(
            'wss://new-stellarburgers.education-services.ru/orders/all'
          );

          socket.addEventListener('message', (event) => {
            if (typeof event.data !== 'string') return;

            const message = JSON.parse(event.data) as OrderMessage;

            api.updateCachedData((draft) => {
              Object.assign(draft, message);
            });
          });

          socket.addEventListener('error', (error) => {
            console.error('WebSocket error:', error);

            socket?.close();
          });

          socket.addEventListener('close', () => {
            console.log('WebSocket closed');

            if (!isActive) return;

            reconnectTimer = setTimeout(() => {
              connect();
            }, 3000);
          });
        };

        try {
          await api.cacheDataLoaded;

          connect();

          await api.cacheEntryRemoved;
        } finally {
          isActive = false;

          if (reconnectTimer) {
            clearTimeout(reconnectTimer);
          }

          socket?.close();
        }
      },
    }),

    getHistoryOrders: build.query<OrderMessage, void>({
      query: () => {
        return { url: 'orders' };
      },
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useSubmitOrderMutation,
  useGetOrdersQuery,
  useGetHistoryOrdersQuery,
} = rootApi;
