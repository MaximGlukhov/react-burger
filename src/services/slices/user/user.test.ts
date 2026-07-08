import { describe, expect, it } from 'vitest';

import { userSlice } from './user';

const { setUser } = userSlice.actions;
const { getUser } = userSlice.selectors;

const getState = (): ReturnType<typeof userSlice.getInitialState> =>
  userSlice.getInitialState();

describe('userSlice', () => {
  describe('начальное состояние', () => {
    it('user равен null по умолчанию', () => {
      const state = getState();

      expect(state.user).toBeNull();
    });
  });

  describe('редьюсер setUser', () => {
    it('устанавливает пользователя', () => {
      const prevState = getState();
      const state = userSlice.reducer(
        prevState,
        setUser({ email: 'user@test.com', name: 'Иван' })
      );

      expect(state.user).toEqual({ email: 'user@test.com', name: 'Иван' });
    });

    it('сбрасывает пользователя в null', () => {
      let state = getState();
      state = userSlice.reducer(
        state,
        setUser({ email: 'user@test.com', name: 'Иван' })
      );
      state = userSlice.reducer(state, setUser(null));

      expect(state.user).toBeNull();
    });
  });

  describe('селекторы', () => {
    it('getUser возвращает пользователя', () => {
      let state = getState();
      state = userSlice.reducer(state, setUser({ email: 'a@b.com', name: 'Петр' }));

      expect(getUser({ user: state })).toEqual({ email: 'a@b.com', name: 'Петр' });
    });

    it('getUser возвращает null если пользователь не установлен', () => {
      const state = getState();

      expect(getUser({ user: state })).toBeNull();
    });
  });
});
