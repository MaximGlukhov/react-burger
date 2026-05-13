import { useDispatch, useSelector } from '@/services/hooks';
import { useSubmitOrderMutation } from '@/services/slices/api/api';
import {
  addIngredient,
  getConstructorIngredients,
  getConstructorSum,
  setOrderData,
} from '@/services/slices/burger-constructor/burger-constructor-slice';
import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { ConstructorItem } from '../constructor-item/constructor-item';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): React.JSX.Element => {
  const [openModal, setopenModal] = useState(false);
  const [submitOrder, { isLoading }] = useSubmitOrderMutation();
  const dispatch = useDispatch();
  const constructorIngredients = useSelector(getConstructorIngredients);
  const sum = useSelector(getConstructorSum);

  const [{ isHover, draggedItem }, drop] = useDrop({
    accept: 'ingredient',
    collect: (monitor) => ({
      isHover: monitor.isOver(),
      draggedItem: monitor.getItem(),
    }),
    drop: (item: { ingredient: TIngredient }) => {
      dispatch(addIngredient(item.ingredient));
    },
  });

  const [, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: {
      ingredient: constructorIngredients,
    },
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  })) as unknown as [{ isDragging: boolean }, React.RefCallback<HTMLElement>];

  const handleSubmitOrder = (): void => {
    submitOrder(constructorIngredients)
      .unwrap()
      .then((data) => {
        setopenModal(true);
        dispatch(setOrderData({ order: data.order.number, name: data.name }));
      })
      .catch((err) => console.warn(err));
  };

  const hasBuns = constructorIngredients.some((item) => item.type === 'bun');
  const hasFilling = constructorIngredients.some((item) => item.type === 'main');

  return (
    <>
      <section className={`${styles.burger_constructor} ml-10`}>
        <ul
          ref={(node) => {
            drop(node);
          }}
          className={`${styles.list} custom-scroll`}
        >
          {!hasBuns && (
            <li
              ref={dragRef}
              style={{
                border:
                  isHover && draggedItem.ingredient.type === 'bun'
                    ? '2px dashed lightgreen'
                    : '2px dashed transparent',
              }}
              className={`${styles.emptyItem} ${styles.emptyItemTop}`}
            >
              Выберите булки
            </li>
          )}
          {constructorIngredients.map((ingredient, index) => (
            <ConstructorItem
              key={ingredient.uniqId}
              ingredient={ingredient}
              index={index}
              length={constructorIngredients.length}
              order={
                index === 0 && hasBuns && !hasFilling
                  ? 1
                  : index === 1 && hasBuns && !hasFilling
                    ? 3
                    : !hasBuns && hasFilling
                      ? 2
                      : undefined
              }
            />
          ))}
          {!hasFilling && (
            <li
              style={{
                border:
                  isHover && draggedItem.ingredient.type === 'main'
                    ? '2px dashed lightgreen'
                    : '2px dashed transparent',
              }}
              className={`${styles.emptyItem} ${styles.emptyItemNotFilling}`}
            >
              Выберите начинку
            </li>
          )}
          {!hasBuns && (
            <li
              style={{
                border:
                  isHover && draggedItem.ingredient.type === 'bun'
                    ? '2px dashed lightgreen'
                    : '2px dashed transparent',
              }}
              className={`${styles.emptyItem} ${styles.emptyItemBottom}`}
            >
              Выберите булки
            </li>
          )}
        </ul>

        <footer className={`${styles.footer} mt-10`}>
          <div className="text text_type_digits-medium">
            {sum} <CurrencyIcon type="primary" />
          </div>
          <Button
            disabled={isLoading || constructorIngredients.length < 3}
            onClick={handleSubmitOrder}
            htmlType={'button'}
          >
            Оформить заказ
          </Button>
        </footer>
      </section>
      {openModal && (
        <Modal closePopup={() => setopenModal(false)}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
