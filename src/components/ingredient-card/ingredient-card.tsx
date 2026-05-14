import { useDispatch, useSelector } from '@/services/hooks';
import { getIngredientsCounts } from '@/services/slices/burger-constructor/burger-constructor-slice';
import { setIngredientDetail } from '@/services/slices/ingredient-detail/ingredient-detail-slice';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDrag } from 'react-dnd';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  ingredientData: TIngredient;
};

export const IngredientCard = ({
  ingredientData,
}: IngredientCardProps): React.JSX.Element => {
  const {
    image_large,
    image,
    name,
    calories,
    proteins,
    fat,
    carbohydrates,
    price,
    _id,
  } = ingredientData;

  const dispatch = useDispatch();
  const count = useSelector(getIngredientsCounts);

  const [openModal, setOpenModal] = useState(false);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'ingredient',
    item: {
      ingredient: ingredientData,
    },
    collect: (monitor): { isDragging: boolean } => ({
      isDragging: monitor.isDragging(),
    }),
  })) as unknown as [{ isDragging: boolean }, React.RefCallback<HTMLElement>];

  const handleOpenModal = (): void => {
    dispatch(
      setIngredientDetail({
        image_large,
        name,
        calories,
        proteins,
        fat,
        carbohydrates,
      })
    );

    setOpenModal(true);
  };

  const hideModal = (): void => {
    setOpenModal(false);
    dispatch(setIngredientDetail(null));
  };

  return (
    <>
      <article
        ref={dragRef}
        onClick={handleOpenModal}
        className={`${styles.card} p-4`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'grab',
        }}
      >
        <img src={image} alt={name} />

        <div className={`${styles.price} mt-2 mb-2`}>
          <p className={'text text_type_digits-default mr-2'}>{price}</p>

          <CurrencyIcon type="primary" />
        </div>

        <p className={'text text_type_main-default'}>{name}</p>

        {count[_id] > 0 && <Counter count={count[_id]} size="default" />}
      </article>

      {openModal && (
        <Modal closePopup={hideModal} title={'Детали ингредиента'}>
          <IngredientDetails />
        </Modal>
      )}
    </>
  );
};
