import { useGetHistoryOrdersQuery } from '@/services/slices/api/api';

export const ProfileOrderPage = (): React.JSX.Element => {
  const { data: orders } = useGetHistoryOrdersQuery();

  return (
    <section>
      {orders?.orders.map((order) => (
        <div key={order._id} className="order-card"></div>
      ))}
    </section>
  );
};
