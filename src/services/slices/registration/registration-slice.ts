import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TRegistrationForm = {
  email: string;
  password: string;
  name: string;
};

export type TFormField = keyof TRegistrationForm;

type TInitialState = {
  form: TRegistrationForm;
};

const initialState: TInitialState = {
  form: {
    email: '',
    password: '',
    name: '',
  },
};

export const registrationSlice = createSlice({
  name: 'registration',
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

export const { updateForm } = registrationSlice.actions;
export const { getForm } = registrationSlice.selectors;
