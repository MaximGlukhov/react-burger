import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetails } from '../app/ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  count: number;
  ingredientData: TIngredient;
};

export const IngredientCard = ({
  count = 0,
  ingredientData,
}: IngredientCardProps): React.JSX.Element => {
  const { name, image, image_large, price, calories, proteins, fat, carbohydrates } =
    ingredientData;
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (): void => {
    setOpenModal(true);
  };

  return (
    <>
      <article onClick={handleOpenModal} className={`${styles.card} p-4`}>
        <img src={image} alt={name} />
        <div className={`${styles.price} mt-2 mb-2`}>
          <p className={'text text_type_digits-default mr-2'}>{price}</p>
          <CurrencyIcon type="primary" />
        </div>

        <p className={'text text_type_main-default'}>{name}</p>
        {count > 0 && <Counter count={count} size="default" />}
      </article>

      {openModal && (
        <Modal closePopup={() => setOpenModal(false)} title={'Детали ингредиента'}>
          <IngredientDetails
            imageSrc={image_large}
            name={name}
            calories={calories}
            proteins={proteins}
            fat={fat}
            carbohydrates={carbohydrates}
          />
        </Modal>
      )}
    </>
  );
};
