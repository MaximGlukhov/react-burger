import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

export type TUniqIngredient = {
  uniqId: string;
} & TIngredient;

type TInitialState = {
  ingredients: TUniqIngredient[];
  order: number;
  burgerName: string;
};

const initialState: TInitialState = {
  ingredients: [],
  order: 0,
  burgerName: '',
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,

  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        const bunTop = {
          ...action.payload,
          uniqId: nanoid(),
        };

        const bunBottom = {
          ...action.payload,
          uniqId: nanoid(),
        };

        const middleIngredients = state.ingredients.filter(
          (item) => item.type !== 'bun'
        );

        state.ingredients = [bunTop, ...middleIngredients, bunBottom];
      } else {
        const hasBun = state.ingredients.some((item) => item.type === 'bun');

        const ingredient = {
          ...action.payload,
          uniqId: nanoid(),
        };

        if (hasBun) {
          state.ingredients.splice(state.ingredients.length - 1, 0, ingredient);
        } else {
          state.ingredients.push(ingredient);
        }
      }
    },

    moveIngredient: (
      state,
      action: PayloadAction<{
        dragIndex: number;
        hoverIndex: number;
      }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;

      const dragItem = state.ingredients[dragIndex];
      const hoverItem = state.ingredients[hoverIndex];

      if (!dragItem || dragItem.type === 'bun') {
        return;
      }

      if (!hoverItem || hoverItem.type === 'bun') {
        return;
      }

      const updatedIngredients = [...state.ingredients];

      updatedIngredients.splice(dragIndex, 1);

      updatedIngredients.splice(hoverIndex, 0, dragItem);

      state.ingredients = updatedIngredients;
    },

    removeIngredient(state, action: PayloadAction<TUniqIngredient>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.uniqId !== action.payload.uniqId
      );
    },

    setOrderData(state, action: PayloadAction<{ order: number; name: string }>) {
      state.burgerName = action.payload.name;
      state.order = action.payload.order;
    },
  },

  selectors: {
    getConstructorIngredients: (state) => state.ingredients,
    getOrderNumber: (state) => state.order,
    getBurgerName: (state) => state.burgerName,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, setOrderData } =
  burgerConstructorSlice.actions;

export const { getConstructorIngredients, getOrderNumber, getBurgerName } =
  burgerConstructorSlice.selectors;

export const getConstructorSum = createSelector(
  [getConstructorIngredients],
  (ingredients) => ingredients.reduce((acc, item) => acc + item.price, 0)
);

export const getIngredientsCounts = createSelector(
  [getConstructorIngredients],
  (ingredients) => {
    return ingredients.reduce<Record<string, number>>((acc, item) => {
      acc[item._id] = (acc[item._id] || 0) + 1;

      return acc;
    }, {});
  }
);
