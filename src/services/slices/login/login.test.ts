import { describe, expect, it } from 'vitest';

import { loginSlice } from './login';

const { updateForm } = loginSlice.actions;
const { getForm } = loginSlice.selectors;

const getState = (): ReturnType<typeof loginSlice.getInitialState> =>
  loginSlice.getInitialState();

describe('loginSlice', () => {
  describe('начальное состояние', () => {
    it('имеет пустые поля формы', () => {
      const state = getState();

      expect(state.form).toEqual({ email: '', password: '' });
    });
  });

  describe('редьюсер updateForm', () => {
    it('обновляет поле email', () => {
      const prevState = getState();
      const state = loginSlice.reducer(
        prevState,
        updateForm({ name: 'email', value: 'test@example.com' })
      );

      expect(state.form.email).toBe('test@example.com');
      expect(state.form.password).toBe('');
    });

    it('обновляет поле password', () => {
      const prevState = getState();
      const state = loginSlice.reducer(
        prevState,
        updateForm({ name: 'password', value: 'secret123' })
      );

      expect(state.form.password).toBe('secret123');
      expect(state.form.email).toBe('');
    });

    it('обновляет несколько полей последовательно', () => {
      let state = getState();
      state = loginSlice.reducer(
        state,
        updateForm({ name: 'email', value: 'user@test.com' })
      );
      state = loginSlice.reducer(
        state,
        updateForm({ name: 'password', value: 'p@ssw0rd' })
      );

      expect(state.form).toEqual({ email: 'user@test.com', password: 'p@ssw0rd' });
    });
  });

  describe('селекторы', () => {
    it('getForm возвращает форму', () => {
      let state = getState();
      state = loginSlice.reducer(
        state,
        updateForm({ name: 'email', value: 'sel@test.com' })
      );

      expect(getForm({ login: state })).toEqual({
        email: 'sel@test.com',
        password: '',
      });
    });
  });
});
