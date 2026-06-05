import { Link } from 'react-router-dom';

import styles from './error-page.module.css';

export const ErrorPage = (): React.JSX.Element => {
  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-large">Что то пошло не так...</h1>
      <p className="text text_type_main-default">
        Попробуйте позже или обратитесь к администратору.
      </p>
      <Link to="/" className="text text_type_main-default">
        На главную
      </Link>
    </section>
  );
};
