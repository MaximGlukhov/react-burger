import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TForgotForm = {
  email: string;
};

export type TFormField = keyof TForgotForm;

type TInitialState = {
  form: TForgotForm;
};

const initialState: TInitialState = {
  form: {
    email: '',
  },
};

export const forgotSlice = createSlice({
  name: 'forgot',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<{ name: TFormField; value: string }>) {
      state.form[action.payload.name] = action.payload.value;
    },
  },
  selectors: {
    getForm: (state) => state.form,
  },
});

export const { updateForm } = forgotSlice.actions;
export const { getForm } = forgotSlice.selectors;
