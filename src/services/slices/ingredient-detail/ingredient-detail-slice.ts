import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TIngredientDetails = {
  image_large: string;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
};

type TInitialState = {
  ingredientDetails: TIngredientDetails | null;
};

const initialState: TInitialState = {
  ingredientDetails: null,
};

export const ingredientDetailSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetail(state, action: PayloadAction<TIngredientDetails | null>) {
      state.ingredientDetails = action.payload;
    },
  },
  selectors: {
    getIngredientDetail: (state) => state.ingredientDetails,
  },
});

export const { setIngredientDetail } = ingredientDetailSlice.actions;
export const { getIngredientDetail } = ingredientDetailSlice.selectors;
