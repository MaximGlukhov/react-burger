import { useDispatch, useSelector } from '@/services/hooks';
import { useGetIngredientsQuery, useGetOrdersQuery } from '@/services/slices/api/api';
import {
  getOpenModal,
  getOrderDetail,
  setOpenModal,
  setOrderDetail,
} from '@/services/slices/order-detail/order-detai-slice';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '../modal/modal';

import styles from './order-modal.module.css';

export const OrderModal = (): React.JSX.Element | null => {
  const { data: ordersData } = useGetOrdersQuery();
  const { data: ingredientsData } = useGetIngredientsQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = useSelector(getOpenModal);
  const order = useSelector(getOrderDetail);
  const { id } = useParams();

  const hideModal = (): void => {
    dispatch(setOpenModal(false));
    dispatch(setOrderDetail(null));
    void navigate(-1);
  };

  const ingredientsMap = useMemo(
    () =>
      Object.fromEntries(
        (ingredientsData?.data ?? []).map((ingredient) => [ingredient._id, ingredient])
      ),
    [ingredientsData]
  );

  const totalPrice = order?.ingredients.reduce((sum, ing) => {
    return sum + ing.price * ing.count;
  }, 0);

  const statusText =
    order?.status === 'done'
      ? 'Выполнен'
      : order?.status === 'create'
        ? 'Создан'
        : 'В работе';

  useEffect(() => {
    const transformOrders = ordersData?.orders.map((item) => {
      const counts = item.ingredients.reduce(
        (acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        ...item,
        ingredients: Object.entries(counts).map(([id, count]) => ({
          ...ingredientsMap[id],
          count,
        })),
      };
    });

    const findOrder = transformOrders?.find((item) => item._id === id);

    if (!findOrder) return;

    dispatch(setOrderDetail(findOrder));
    dispatch(setOpenModal(true));
  }, [dispatch, id, ingredientsMap, ordersData]);

  if (!openModal || !order) return null;

  return (
    <Modal closePopup={hideModal}>
      <h2 className="text text_type_digits-default mb-10">#{order?.number}</h2>

      <p className="text text_type_main-medium mb-3">{order?.name}</p>
      <p className="text text_type_main-default mb-15">{statusText}</p>
      <p className="text text_type_main-medium mb-6">Состав:</p>
      <ul className={`custom-scroll ${styles.list}`}>
        {order?.ingredients.map((item) => (
          <li className={styles.item} key={item._id}>
            <div className={styles.image}>
              <div className={styles.imageBorder}>
                <img src={item.image} alt={item.name} />
              </div>
            </div>

            <p className="text text_type_main-default">{item.name}</p>
            <div className={styles.price}>
              <p className="text text_type_digits-default mr-2">
                {item.count} x {item.price}
              </p>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
        <div className={styles.price}>
          <p className="text text_type_digits-default mr-2">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </div>
      </footer>
    </Modal>
  );
};
