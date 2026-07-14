import { describe, expect, it } from 'vitest';

import { burgerConstructorSlice } from './burger-constructor-slice';

import type { TIngredient } from '@/utils/types';

const {
  addIngredient,
  clearIngredients,
  moveIngredient,
  removeIngredient,
  setOrderData,
} = burgerConstructorSlice.actions;
const { getBurgerName, getConstructorIngredients, getOrderNumber } =
  burgerConstructorSlice.selectors;

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
  __v: 0,
};

const mockIngredient: TIngredient = {
  _id: 'ing-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
  __v: 0,
};

const mockIngredient2: TIngredient = {
  _id: 'ing-2',
  name: 'Мясо бессмертных моллюсков',
  type: 'main',
  proteins: 100,
  fat: 50,
  carbohydrates: 20,
  calories: 200,
  price: 300,
  image: 'meat.png',
  image_large: 'meat-large.png',
  image_mobile: 'meat-mobile.png',
  __v: 0,
};

const getState = (): ReturnType<typeof burgerConstructorSlice.getInitialState> =>
  burgerConstructorSlice.getInitialState();

describe('burgerConstructorSlice', () => {
  describe('начальное состояние', () => {
    it('имеет корректное начальное сосотояние', () => {
      const state = getState();

      expect(state.ingredients).toHaveLength(0);
      expect(state.order).toBe(0);
      expect(state.burgerName).toBe('');
    });
  });

  describe('редьюсер addIngredient', () => {
    it('добавляет булку (верх и низ) и заменяет существующую', () => {
      const prevState = getState();
      const action = addIngredient(mockBun);
      const state = burgerConstructorSlice.reducer(prevState, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe('Краторная булка N-200i (верх)');
      expect(state.ingredients[1].name).toBe('Краторная булка N-200i (низ)');
      expect(state.ingredients[0].type).toBe('bun');
      expect(state.ingredients[1].type).toBe('bun');
    });

    it('добавляет обычный ингредиент в конец, если нет булки', () => {
      const prevState = getState();
      const action = addIngredient(mockIngredient);
      const state = burgerConstructorSlice.reducer(prevState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');
    });

    it('добавляет ингредиент перед нижней булкой, когда булка уже есть', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].type).toBe('bun');
      expect(state.ingredients[1].name).toBe('Соус Spicy-X');
      expect(state.ingredients[2].type).toBe('bun');
    });

    it('добавляет несколько ингредиентов между булками', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient2));

      expect(state.ingredients).toHaveLength(4);
      expect(state.ingredients[0].type).toBe('bun');
      expect(state.ingredients[1].name).toBe('Соус Spicy-X');
      expect(state.ingredients[2].name).toBe('Мясо бессмертных моллюсков');
      expect(state.ingredients[3].type).toBe('bun');
    });

    it('замена булки сохраняет средние ингредиенты', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Флюоресцентная булка',
      };
      state = burgerConstructorSlice.reducer(state, addIngredient(newBun));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[0].name).toBe('Флюоресцентная булка (верх)');
      expect(state.ingredients[1].name).toBe('Соус Spicy-X');
      expect(state.ingredients[2].name).toBe('Флюоресцентная булка (низ)');
    });
  });

  describe('редьюсер moveIngredient', () => {
    it('перемещает ингредиент с одного индекса на другой', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient2));

      state = burgerConstructorSlice.reducer(
        state,
        moveIngredient({ dragIndex: 1, hoverIndex: 2 })
      );

      expect(state.ingredients[0].type).toBe('bun');
      expect(state.ingredients[1].name).toBe('Мясо бессмертных моллюсков');
      expect(state.ingredients[2].name).toBe('Соус Spicy-X');
      expect(state.ingredients[3].type).toBe('bun');
    });

    it('не перемещает булку', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));

      state = burgerConstructorSlice.reducer(
        state,
        moveIngredient({ dragIndex: 0, hoverIndex: 2 })
      );

      expect(state.ingredients[0].name).toBe('Краторная булка N-200i (верх)');
      expect(state.ingredients[1].name).toBe('Соус Spicy-X');
    });

    it('не перемещает на место булки', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));

      state = burgerConstructorSlice.reducer(
        state,
        moveIngredient({ dragIndex: 1, hoverIndex: 2 })
      );

      expect(state.ingredients[0].name).toBe('Краторная булка N-200i (верх)');
      expect(state.ingredients[1].name).toBe('Соус Spicy-X');
      expect(state.ingredients[2].name).toBe('Краторная булка N-200i (низ)');
    });
  });

  describe('редьюсер removeIngredient', () => {
    it('удаляет ингредиент по uniqId', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient2));

      const ingredientToRemove = state.ingredients[0];
      state = burgerConstructorSlice.reducer(
        state,
        removeIngredient(ingredientToRemove)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Мясо бессмертных моллюсков');
    });

    it('не удаляет ничего, если uniqId не совпадает', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));

      state = burgerConstructorSlice.reducer(
        state,
        removeIngredient({ ...mockIngredient, uniqId: 'nonexistent' })
      );

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('редьюсер clearIngredients', () => {
    it('очищает все ингредиенты', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockBun));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient2));

      state = burgerConstructorSlice.reducer(state, clearIngredients());

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('редьюсер setOrderData', () => {
    it('устанавливает данные заказа', () => {
      const prevState = getState();
      const state = burgerConstructorSlice.reducer(
        prevState,
        setOrderData({ order: 12345, name: 'Бургер мечты' })
      );

      expect(state.order).toBe(12345);
      expect(state.burgerName).toBe('Бургер мечты');
    });
  });

  describe('начальное состояние', () => {
    it('имеет корректное начальное состояние', () => {
      const state = getState();

      expect(state.ingredients).toEqual([]);
      expect(state.order).toBe(0);
      expect(state.burgerName).toBe('');
    });
  });

  describe('селекторы', () => {
    it('getConstructorIngredients возвращает ингредиенты', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(state, addIngredient(mockIngredient));

      expect(getConstructorIngredients({ burgerConstructor: state })).toHaveLength(1);
    });

    it('getOrderNumber возвращает номер заказа', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(
        state,
        setOrderData({ order: 42, name: 'test' })
      );

      expect(getOrderNumber({ burgerConstructor: state })).toBe(42);
    });

    it('getBurgerName возвращает имя бургера', () => {
      let state = getState();
      state = burgerConstructorSlice.reducer(
        state,
        setOrderData({ order: 1, name: 'Супербургер' })
      );

      expect(getBurgerName({ burgerConstructor: state })).toBe('Супербургер');
    });
  });
});
