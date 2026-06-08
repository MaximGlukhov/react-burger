import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TResetForm = {
  password: string;
  token: string;
};

export type TFormField = keyof TResetForm;

type TInitialState = {
  form: TResetForm;
};

const initialState: TInitialState = {
  form: {
    password: '',
    token: '',
  },
};

export const resetSlice = createSlice({
  name: 'reset',
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

export const { updateForm } = resetSlice.actions;
export const { getForm } = resetSlice.selectors;
