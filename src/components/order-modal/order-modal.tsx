import { useDispatch, useSelector } from '@/services/hooks';
import {
  useGetHistoryOrdersQuery,
  useGetIngredientsQuery,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} from '@/services/slices/api/api';
import {
  getOpenModal,
  getOrderDetail,
  setOpenModal,
  setOrderDetail,
} from '@/services/slices/order-detail/order-detai-slice';
import { getUser } from '@/services/slices/user/user';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Modal } from '../modal/modal';

import type { TOrederTransform, TOrder } from '@/utils/types';

import styles from './order-modal.module.css';

type TOrderModalProps = {
  back: string;
};

export const OrderModal = ({ back }: TOrderModalProps): React.JSX.Element | null => {
  const { id } = useParams();
  const skipOrderId = useRef(true);

  const user = useSelector(getUser);
  const isAuthorized = user !== null;

  const { data: ordersData } = useGetOrdersQuery();
  const { data: historyOrdersData } = useGetHistoryOrdersQuery(undefined, {
    skip: !isAuthorized,
  });
  const { data: ingredientsData } = useGetIngredientsQuery();
  const { data: orderId, isFetching } = useGetOrderByIdQuery(id ?? '', {
    skip: skipOrderId.current,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = useSelector(getOpenModal);
  const order = useSelector(getOrderDetail);

  const hideModal = (): void => {
    dispatch(setOpenModal(false));
    dispatch(setOrderDetail(null));
    skipOrderId.current = true;
    void navigate(back);
  };

  const ingredientsMap = useMemo(
    () =>
      Object.fromEntries(
        (ingredientsData?.data ?? []).map((ingredient) => [ingredient._id, ingredient])
      ),
    [ingredientsData]
  );

  const totalPrice = order?.ingredients.reduce(
    (sum, ing) => sum + ing.price * ing.count,
    0
  );

  const statusText =
    order?.status === 'done'
      ? 'Выполнен'
      : order?.status === 'create'
        ? 'Создан'
        : 'В работе';

  useEffect(() => {
    if (
      !id ||
      !ordersData ||
      (!historyOrdersData && isAuthorized) ||
      !ingredientsData ||
      !ingredientsMap
    ) {
      return;
    }
    const allOrders: TOrder[] = [
      ...(ordersData?.orders ?? []),
      ...(historyOrdersData?.orders ?? []),
    ];

    const transformOrder = (item: TOrder): TOrederTransform => {
      const counts = item.ingredients.reduce(
        (acc: Record<string, number>, ingredientId: string) => {
          acc[ingredientId] = (acc[ingredientId] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        ...item,
        ingredients: Object.entries(counts).map(([ingredientId, count]) => ({
          ...(ingredientsMap[ingredientId] ?? {}),
          count,
        })),
      } as TOrederTransform;
    };

    const found = allOrders.find((o) => o._id === id);

    if (found) {
      dispatch(setOrderDetail(transformOrder(found)));
      dispatch(setOpenModal(true));
    } else {
      dispatch(setOpenModal(true));
      skipOrderId.current = false;
      if (orderId) {
        const transformed = transformOrder(orderId.order);
        dispatch(setOrderDetail(transformed));
      }
    }
  }, [ordersData, historyOrdersData, skipOrderId]);

  if (!openModal || !order) return null;

  return (
    <Modal closePopup={hideModal}>
      {isFetching && <>Loading</>}
      <h2 className="text text_type_digits-default mb-10">#{order?.number}</h2>

      <p className="text text_type_main-medium mb-3">{order?.name}</p>
      <p className="text text_type_main-default mb-15 green-text">{statusText}</p>
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
