import { describe, expect, it } from 'vitest';

import { registrationSlice } from './registration-slice';

const { updateForm } = registrationSlice.actions;
const { getForm } = registrationSlice.selectors;

const getState = (): ReturnType<typeof registrationSlice.getInitialState> =>
  registrationSlice.getInitialState();

describe('registrationSlice', () => {
  describe('начальное состояние', () => {
    it('имеет пустые поля формы', () => {
      const state = getState();

      expect(state.form).toEqual({ email: '', password: '', name: '' });
    });
  });

  describe('редьюсер updateForm', () => {
    it('обновляет поле email', () => {
      const prevState = getState();
      const state = registrationSlice.reducer(
        prevState,
        updateForm({ name: 'email', value: 'new@example.com' })
      );

      expect(state.form.email).toBe('new@example.com');
    });

    it('обновляет поле password', () => {
      const prevState = getState();
      const state = registrationSlice.reducer(
        prevState,
        updateForm({ name: 'password', value: 'securePass' })
      );

      expect(state.form.password).toBe('securePass');
    });

    it('обновляет поле name', () => {
      const prevState = getState();
      const state = registrationSlice.reducer(
        prevState,
        updateForm({ name: 'name', value: 'Иван' })
      );

      expect(state.form.name).toBe('Иван');
    });

    it('обновляет все поля последовательно', () => {
      let state = getState();
      state = registrationSlice.reducer(
        state,
        updateForm({ name: 'email', value: 'ivan@test.com' })
      );
      state = registrationSlice.reducer(
        state,
        updateForm({ name: 'password', value: '123456' })
      );
      state = registrationSlice.reducer(
        state,
        updateForm({ name: 'name', value: 'Иван' })
      );

      expect(state.form).toEqual({
        email: 'ivan@test.com',
        password: '123456',
        name: 'Иван',
      });
    });
  });

  describe('селекторы', () => {
    it('getForm возвращает форму', () => {
      let state = getState();
      state = registrationSlice.reducer(
        state,
        updateForm({ name: 'name', value: 'Петр' })
      );

      expect(getForm({ registration: state })).toEqual({
        email: '',
        password: '',
        name: 'Петр',
      });
    });
  });
});
