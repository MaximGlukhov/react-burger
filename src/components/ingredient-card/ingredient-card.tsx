import { useDispatch, useSelector } from '@/services/hooks';
import { getIngredientsCounts } from '@/services/slices/burger-constructor/burger-constructor-slice';
import { setOpenModal } from '@/services/slices/ingredient-detail/ingredient-detail-slice';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Link } from 'react-router-dom';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  ingredientData: TIngredient;
};

export const IngredientCard = ({
  ingredientData,
}: IngredientCardProps): React.JSX.Element => {
  const { image, name, price, _id } = ingredientData;

  const dispatch = useDispatch();
  const count = useSelector(getIngredientsCounts);

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
    dispatch(setOpenModal(true));
  };

  return (
    <>
      <Link to={`/ingredients/${_id}`} className={styles.link}>
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
      </Link>
    </>
  );
};
