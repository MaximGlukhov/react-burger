import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type IUser = {
  email: string;
  name: string;
};

type TInitialState = {
  user: IUser | null;
};

const initialState: TInitialState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
  },
  selectors: {
    getUser: (state) => state.user,
  },
});

export const { setUser } = userSlice.actions;
export const { getUser } = userSlice.selectors;
