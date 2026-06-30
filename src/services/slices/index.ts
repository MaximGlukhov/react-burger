import { combineReducers } from '@reduxjs/toolkit';

import { rootApi } from './api/api';
import { authApi } from './api/authApi';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { forgotSlice } from './forgot-password/forgot-password';
import { ingredientDetailSlice } from './ingredient-detail/ingredient-detail-slice';
import { loginSlice } from './login/login';
import { orderDetailSlice } from './order-detail/order-detai-slice';
import { registrationSlice } from './registration/registration-slice';
import { resetSlice } from './reset-password/reset-password';
import { userSlice } from './user/user';

export const rootReducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  orderDetails: orderDetailSlice.reducer,
  ingredientDetails: ingredientDetailSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
  registration: registrationSlice.reducer,
  login: loginSlice.reducer,
  forgot: forgotSlice.reducer,
  reset: resetSlice.reducer,
  user: userSlice.reducer,
});
