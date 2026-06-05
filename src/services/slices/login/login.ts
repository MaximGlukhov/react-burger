import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TLoginForm = {
  email: string;
  password: string;
};

export type TFormField = keyof TLoginForm;

type TInitialState = {
  form: TLoginForm;
};

const initialState: TInitialState = {
  form: {
    email: '',
    password: '',
  },
};

export const loginSlice = createSlice({
  name: 'login',
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

export const { updateForm } = loginSlice.actions;
export const { getForm } = loginSlice.selectors;
