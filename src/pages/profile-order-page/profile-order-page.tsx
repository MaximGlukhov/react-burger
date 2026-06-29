import { OrderCard } from '@/components/order-card/order-card';
import { useGetHistoryOrdersQuery } from '@/services/slices/api/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Link, Outlet } from 'react-router-dom';

import styles from './profile-order-page.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  const { data: orders, isLoading } = useGetHistoryOrdersQuery();

  return (
    <>
      {isLoading && <Preloader />}
      <ul className={`${styles.listOrders} custom-scroll`}>
        {orders?.orders.map((order) => (
          <li key={order._id} className={styles.item}>
            <Link className={styles.link} to={order._id}>
              <OrderCard status={true} order={order} />
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </>
  );
};
