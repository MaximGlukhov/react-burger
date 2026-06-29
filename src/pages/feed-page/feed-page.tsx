import { OrderCard } from '@/components/order-card/order-card';
import { useGetOrdersQuery } from '@/services/slices/api/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Link, Outlet } from 'react-router-dom';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const { data, isLoading } = useGetOrdersQuery();

  const COUNT_ORDERS = 10;

  return (
    <>
      <h1 className="text text_type_main-large mt-10 mb-5 pl-5">Лента заказов</h1>

      {isLoading && <Preloader />}

      <div className={styles.feeds}>
        <ul className={`${styles.listOrders} custom-scroll`}>
          {data?.orders.map((item) => {
            return (
              <li key={item._id}>
                <Link className={styles.link} to={item._id}>
                  <OrderCard status={false} order={item} />
                </Link>
              </li>
            );
          })}
        </ul>

        <section className={`custom-scroll ${styles.statuses}`}>
          <div className={styles.statusesList}>
            <div>
              <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
              <ul className={`${styles.readyList} ${styles.list}`}>
                {data?.orders
                  .filter((item) => item.status === 'done')
                  .slice(0, COUNT_ORDERS)
                  .map((item) => (
                    <li key={item._id} className="text text_type_digits-default">
                      {item.number}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>
              <ul className={`${styles.list}`}>
                {data?.orders
                  .filter((item) => item.status === 'pending')
                  .slice(0, COUNT_ORDERS)
                  .map((item) => (
                    <li key={item._id} className="text text_type_digits-default">
                      {item.number}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div>
            <p className="text text_type_main-medium">Выполнено за все время:</p>
            <p className="text text_type_digits-large">{data?.total}</p>
          </div>

          <div>
            <p className="text text_type_main-medium">Выполнено за сегодня:</p>
            <p className="text text_type_digits-large">{data?.totalToday}</p>
          </div>
        </section>
      </div>

      <Outlet />
    </>
  );
};
