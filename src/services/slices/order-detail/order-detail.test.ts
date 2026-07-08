import { describe, expect, it } from 'vitest';

import { orderDetailSlice } from './order-detai-slice';

import type { TOrederTransform } from '@/utils/types';

const { setOrderDetail, setOpenModal } = orderDetailSlice.actions;
const { getOpenModal, getOrderDetail } = orderDetailSlice.selectors;

const mockOrder: TOrederTransform = {
  _id: 'order-1',
  number: 12345,
  name: 'Космический бургер',
  status: 'done',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:05:00Z',
  ingredients: [
    {
      _id: 'ing-1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 30,
      calories: 200,
      price: 100,
      image: 'img.png',
      image_large: 'img-large.png',
      image_mobile: 'img-mobile.png',
      __v: 0,
      count: 2,
    },
  ],
};

const getState = (): ReturnType<typeof orderDetailSlice.getInitialState> =>
  orderDetailSlice.getInitialState();

describe('orderDetailSlice', () => {
  describe('начальное состояние', () => {
    it('имеет корректное начальное состояние', () => {
      const state = getState();

      expect(state.orderDetails).toBeNull();
      expect(state.openModal).toBe(false);
    });
  });

  describe('редьюсер setOrderDetail', () => {
    it('устанавливает детали заказа', () => {
      const prevState = getState();
      const state = orderDetailSlice.reducer(prevState, setOrderDetail(mockOrder));

      expect(state.orderDetails).toEqual(mockOrder);
    });

    it('сбрасывает детали заказа в null', () => {
      let state = getState();
      state = orderDetailSlice.reducer(state, setOrderDetail(mockOrder));
      state = orderDetailSlice.reducer(state, setOrderDetail(null));

      expect(state.orderDetails).toBeNull();
    });
  });

  describe('редьюсер setOpenModal', () => {
    it('открывает модальное окно', () => {
      const prevState = getState();
      const state = orderDetailSlice.reducer(prevState, setOpenModal(true));

      expect(state.openModal).toBe(true);
    });

    it('закрывает модальное окно', () => {
      let state = getState();
      state = orderDetailSlice.reducer(state, setOpenModal(true));
      state = orderDetailSlice.reducer(state, setOpenModal(false));

      expect(state.openModal).toBe(false);
    });
  });

  describe('селекторы', () => {
    it('getOrderDetail возвращает детали заказа', () => {
      let state = getState();
      state = orderDetailSlice.reducer(state, setOrderDetail(mockOrder));

      expect(getOrderDetail({ orderDetails: state })).toEqual(mockOrder);
    });

    it('getOpenModal возвращает состояние модалки', () => {
      let state = getState();
      state = orderDetailSlice.reducer(state, setOpenModal(true));

      expect(getOpenModal({ orderDetails: state })).toBe(true);
    });
  });
});
