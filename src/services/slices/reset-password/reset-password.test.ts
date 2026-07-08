import { describe, expect, it } from 'vitest';

import { resetSlice } from './reset-password';

const { updateForm } = resetSlice.actions;
const { getForm } = resetSlice.selectors;

const getState = (): ReturnType<typeof resetSlice.getInitialState> =>
  resetSlice.getInitialState();

describe('resetSlice', () => {
  describe('начальное состояние', () => {
    it('имеет пустые поля формы', () => {
      const state = getState();

      expect(state.form).toEqual({ password: '', token: '' });
    });
  });

  describe('редьюсер updateForm', () => {
    it('обновляет поле password', () => {
      const prevState = getState();
      const state = resetSlice.reducer(
        prevState,
        updateForm({ name: 'password', value: 'newPass123' })
      );

      expect(state.form.password).toBe('newPass123');
    });

    it('обновляет поле token', () => {
      const prevState = getState();
      const state = resetSlice.reducer(
        prevState,
        updateForm({ name: 'token', value: 'abc-token-xyz' })
      );

      expect(state.form.token).toBe('abc-token-xyz');
    });

    it('обновляет оба поля последовательно', () => {
      let state = getState();
      state = resetSlice.reducer(
        state,
        updateForm({ name: 'password', value: 'qwerty' })
      );
      state = resetSlice.reducer(state, updateForm({ name: 'token', value: 'tok-123' }));

      expect(state.form).toEqual({ password: 'qwerty', token: 'tok-123' });
    });
  });

  describe('селекторы', () => {
    it('getForm возвращает форму', () => {
      let state = getState();
      state = resetSlice.reducer(state, updateForm({ name: 'password', value: 'pwd' }));

      expect(getForm({ reset: state })).toEqual({ password: 'pwd', token: '' });
    });
  });
});
