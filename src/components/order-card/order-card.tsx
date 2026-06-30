import { useDispatch } from '@/services/hooks';
import { useGetIngredientsQuery } from '@/services/slices/api/api';
import { setOpenModal } from '@/services/slices/order-detail/order-detai-slice';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TOrder } from '@/utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  status: boolean;
};

export const OrderCard = ({ order, status }: TOrderCardProps): React.JSX.Element => {
  const dispatch = useDispatch();

  const { data: ingredients } = useGetIngredientsQuery();

  const handleOpenOrderDetail = (): void => {
    dispatch(setOpenModal(true));
  };

  const ingredientsMap = useMemo(
    () =>
      Object.fromEntries(
        (ingredients?.data ?? []).map((ingredient) => [ingredient._id, ingredient])
      ),
    [ingredients]
  );

  const COUNT_IMAGES = 6;

  const orderIngredients = order.ingredients
    .map((id) => ingredientsMap[id])
    .filter(Boolean);

  const uniqueIngredients = Array.from(
    new Map(orderIngredients.map((ingredient) => [ingredient._id, ingredient])).values()
  );

  const totalPrice = orderIngredients.reduce((sum, ingredient) => {
    return sum + ingredient.price;
  }, 0);

  const statusText =
    order?.status === 'done'
      ? 'Выполнен'
      : order?.status === 'create'
        ? 'Создан'
        : 'В работе';

  return (
    <article className={styles.card} onClick={handleOpenOrderDetail}>
      <div className={styles.cardHead}>
        <p className="text text_type_digits-default">#{order.number}</p>

        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
      </div>

      <div>
        <p className="text text_type_main-medium">{order.name}</p>
        {status && (
          <p className="text text_type_main-default green-text">{statusText}</p>
        )}
      </div>

      <div className={styles.cardFooter}>
        <ul className={styles.cardImages}>
          {uniqueIngredients.slice(0, COUNT_IMAGES).map((ingredient) => (
            <li className={styles.cardImage} key={ingredient._id}>
              <div className={styles.border}>
                <img src={ingredient.image_mobile} alt={ingredient.name} />
              </div>
            </li>
          ))}
          {uniqueIngredients.length > COUNT_IMAGES && (
            <li className={styles.count}>+{uniqueIngredients.length - COUNT_IMAGES}</li>
          )}
        </ul>
        <div className={styles.price}>
          <p className="text text_type_digits-default">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </article>
  );
};
