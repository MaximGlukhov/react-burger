import { useSelector } from '@/services/hooks';
import {
  getBurgerName,
  getOrderNumber,
} from '@/services/slices/burger-constructor/burger-constructor-slice';
import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const orderNumber = useSelector(getOrderNumber);
  const burgerName = useSelector(getBurgerName);

  return (
    <div className={`${styles.order} p-15`}>
      <h2 className="text text_type_digits-large mb-8">{orderNumber}</h2>
      <p className="text text_type_main-medium mb-15">{burgerName}</p>
      <CheckMarkIcon className={`${styles.check} mb-15`} type="primary" />
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
