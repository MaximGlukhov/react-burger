import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrederTransform } from '@/utils/types';

type TInitialState = {
  orderDetails: TOrederTransform | null;
  openModal: boolean;
};

const initialState: TInitialState = {
  orderDetails: null,
  openModal: false,
};

export const orderDetailSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    setOrderDetail(state, action: PayloadAction<TOrederTransform | null>) {
      state.orderDetails = action.payload;
    },
    setOpenModal(state, action: PayloadAction<boolean>) {
      state.openModal = action.payload;
    },
  },
  selectors: {
    getOrderDetail: (state) => state.orderDetails,
    getOpenModal: (state) => state.openModal,
  },
});

export const { setOrderDetail, setOpenModal } = orderDetailSlice.actions;
export const { getOrderDetail, getOpenModal } = orderDetailSlice.selectors;
