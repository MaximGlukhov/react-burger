import { useSelector } from '@/services/hooks';
import { getUser } from '@/services/slices/user/user';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const user = useSelector(getUser);

  const isConstructorActive = pathname === '/';
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
    `${styles.link} ${isActive ? styles.link_active : ''}`;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Тут должны быть ссылки, а не например кнопки или абзацы */}
          <NavLink to="/" end className={getLinkClassName}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) => `${getLinkClassName({ isActive })} ml-10`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <NavLink to="/" className={styles.logo}>
          <Logo />
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${getLinkClassName({ isActive })} ${styles.link_position_last}`
          }
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">
            {user ? user.name : 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
