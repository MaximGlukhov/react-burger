import { describe, expect, it } from 'vitest';

import { ingredientDetailSlice } from './ingredient-detail-slice';

import type { TIngredient } from '@/utils/types';

const { setIngredientDetail, setOpenModal } = ingredientDetailSlice.actions;
const { getIngredientDetail, getOpenModal } = ingredientDetailSlice.selectors;

const mockIngredient: TIngredient = {
  _id: 'ing-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
  __v: 0,
};

const getState = (): ReturnType<typeof ingredientDetailSlice.getInitialState> =>
  ingredientDetailSlice.getInitialState();

describe('ingredientDetailSlice', () => {
  describe('начальное состояние', () => {
    it('имеет корректное начальное состояние', () => {
      const state = getState();

      expect(state.ingredientDetails).toBeNull();
      expect(state.openModal).toBe(false);
    });
  });

  describe('редьюсер setIngredientDetail', () => {
    it('устанавливает детали ингредиента', () => {
      const prevState = getState();
      const state = ingredientDetailSlice.reducer(
        prevState,
        setIngredientDetail(mockIngredient)
      );

      expect(state.ingredientDetails).toEqual(mockIngredient);
    });

    it('сбрасывает детали ингредиента в null', () => {
      const prevState = getState();
      let state = ingredientDetailSlice.reducer(
        prevState,
        setIngredientDetail(mockIngredient)
      );
      state = ingredientDetailSlice.reducer(state, setIngredientDetail(null));

      expect(state.ingredientDetails).toBeNull();
    });
  });

  describe('редьюсер setOpenModal', () => {
    it('открывает модальное окно', () => {
      const prevState = getState();
      const state = ingredientDetailSlice.reducer(prevState, setOpenModal(true));

      expect(state.openModal).toBe(true);
    });

    it('закрывает модальное окно', () => {
      const prevState = getState();
      let state = ingredientDetailSlice.reducer(prevState, setOpenModal(true));
      state = ingredientDetailSlice.reducer(state, setOpenModal(false));

      expect(state.openModal).toBe(false);
    });
  });

  describe('селекторы', () => {
    it('getIngredientDetail возвращает детали', () => {
      let state = getState();
      state = ingredientDetailSlice.reducer(state, setIngredientDetail(mockIngredient));

      expect(getIngredientDetail({ ingredientDetails: state })).toEqual(mockIngredient);
    });

    it('getOpenModal возвращает состояние модалки', () => {
      let state = getState();
      state = ingredientDetailSlice.reducer(state, setOpenModal(true));

      expect(getOpenModal({ ingredientDetails: state })).toBe(true);
    });
  });
});
