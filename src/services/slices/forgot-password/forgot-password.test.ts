import { describe, expect, it } from 'vitest';

import { forgotSlice } from './forgot-password';

const { updateForm } = forgotSlice.actions;
const { getForm } = forgotSlice.selectors;

const getState = (): ReturnType<typeof forgotSlice.getInitialState> =>
  forgotSlice.getInitialState();

describe('forgotSlice', () => {
  describe('начальное состояние', () => {
    it('имеет пустое поле email', () => {
      const state = getState();

      expect(state.form).toEqual({ email: '' });
    });
  });

  describe('редьюсер updateForm', () => {
    it('обновляет поле email', () => {
      const prevState = getState();
      const state = forgotSlice.reducer(
        prevState,
        updateForm({ name: 'email', value: 'reset@example.com' })
      );

      expect(state.form.email).toBe('reset@example.com');
    });
  });

  describe('селекторы', () => {
    it('getForm возвращает форму', () => {
      let state = getState();
      state = forgotSlice.reducer(
        state,
        updateForm({ name: 'email', value: 'forgot@test.com' })
      );

      expect(getForm({ forgot: state })).toEqual({ email: 'forgot@test.com' });
    });
  });
});
