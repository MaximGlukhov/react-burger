import { useLogoutMutation } from '@/services/slices/api/authApi';
import { Button } from '@krgaa/react-developer-burger-ui-components';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void logout()
      .unwrap()
      .then(() => {
        void navigate('/');
      });
  };

  const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    `${styles.link} ${isActive ? styles.link_active : ''}`;

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.menu}>
          <nav className={styles.nav}>
            <NavLink to="/profile" end className={getLinkClassName}>
              Профиль
            </NavLink>
            <NavLink to="/profile/orders" className={getLinkClassName}>
              История заказов
            </NavLink>
            <Button className={styles.link} onClick={handleLogout} htmlType={'submit'}>
              Выход
            </Button>
          </nav>
          <p className="text text_type_main-default text_color_inactive mt-20">
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </div>
        <Outlet />
      </div>
    </section>
  );
};
