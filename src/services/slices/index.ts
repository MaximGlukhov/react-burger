import { combineReducers } from '@reduxjs/toolkit';

import { rootApi } from './api/api';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { ingredientDetailSlice } from './ingredient-detail/ingredient-detail-slice';

export const rootReducer = combineReducers({
  [rootApi.reducerPath]: rootApi.reducer,
  ingredientDetails: ingredientDetailSlice.reducer,
  burgerConstructor: burgerConstructorSlice.reducer,
});
