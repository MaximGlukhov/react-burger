import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './slices';
import { rootApi } from './slices/api/api';
import { authApi } from './slices/api/authApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([rootApi.middleware, authApi.middleware]),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
