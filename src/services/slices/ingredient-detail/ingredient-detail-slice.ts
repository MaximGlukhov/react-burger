import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type TInitialState = {
  ingredientDetails: TIngredient | null;
  openModal: boolean;
};

const initialState: TInitialState = {
  ingredientDetails: null,
  openModal: false,
};

export const ingredientDetailSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetail(state, action: PayloadAction<TIngredient | null>) {
      state.ingredientDetails = action.payload;
    },
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.openModal = action.payload;
    },
  },
  selectors: {
    getIngredientDetail: (state) => state.ingredientDetails,
    getOpenModal: (state) => state.openModal,
  },
});

export const { setIngredientDetail, setOpenModal } = ingredientDetailSlice.actions;
export const { getIngredientDetail, getOpenModal } = ingredientDetailSlice.selectors;
