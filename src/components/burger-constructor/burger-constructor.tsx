import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  sum: number;
};

export const BurgerConstructor = ({
  ingredients,
  sum,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [openModal, setopenModal] = useState(false);

  return (
    <>
      <section className={`${styles.burger_constructor} ml-10`}>
        <ul className={`${styles.list} custom-scroll`}>
          {ingredients.map((ingredient, index) => (
            <li key={ingredient._id}>
              <ConstructorElement
                isLocked
                price={ingredient.price}
                text={ingredient.name}
                thumbnail={ingredient.image}
                type={
                  index === 0
                    ? 'top'
                    : index === ingredients.length - 1
                      ? 'bottom'
                      : undefined
                }
              />
            </li>
          ))}
        </ul>

        <footer className={`${styles.footer} mt-10`}>
          <div className="text text_type_digits-medium">
            {sum} <CurrencyIcon type="primary" />
          </div>
          <Button onClick={() => setopenModal(true)} htmlType={'button'}>
            Оформить заказ
          </Button>
        </footer>
      </section>
      {openModal && (
        <Modal closePopup={() => setopenModal(false)}>
          <OrderDetails orderNumber={345698} />
        </Modal>
      )}
    </>
  );
};
