// pages/LoginPage.tsx
import { useDispatch, useSelector } from '@/services/hooks';
import { useLoginMutation } from '@/services/slices/api/authApi';
import { getForm, updateForm, type TFormField } from '@/services/slices/login/login';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import type { ChangeEvent, FormEventHandler } from 'react';

import styles from './login-page.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const form = useSelector(getForm);
  const [submitLogin, { isLoading }] = useLoginMutation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const handleUpdateForm = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;
    dispatch(updateForm({ name: name as TFormField, value }));
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void submitLogin(form)
      .unwrap()
      .then(() => {
        void navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-medium">Вход</h1>
      <form onSubmit={handleSubmitForm} className={styles.form}>
        <Input
          name={'email'}
          placeholder={'E-mail'}
          value={form.email}
          onChange={handleUpdateForm}
        />
        <Input
          type={'password'}
          name={'password'}
          placeholder={'Пароль'}
          value={form.password}
          onChange={handleUpdateForm}
        />

        <Button disabled={isLoading} htmlType={'submit'}>
          Войти
        </Button>
      </form>
      <footer className={styles.footer}>
        <div className={styles.footerWrap}>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?
          </p>{' '}
          <Link to={'/register'}>Зарегистрироваться</Link>
        </div>
        <div className={styles.footerWrap}>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?
          </p>{' '}
          <Link to={'/forgot-password'}>Восстановить пароль</Link>
        </div>
      </footer>
    </section>
  );
};
