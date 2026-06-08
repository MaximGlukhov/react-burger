import { useDispatch, useSelector } from '@/services/hooks';
import { useResetPasswordMutation } from '@/services/slices/api/authApi';
import {
  getForm,
  updateForm,
  type TFormField,
} from '@/services/slices/reset-password/reset-password';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import type { ChangeEvent, FormEventHandler } from 'react';

import styles from './reset-password-page.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPassword] = useResetPasswordMutation();
  const form = useSelector(getForm);

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void resetPassword(form)
      .unwrap()
      .then(() => {
        localStorage.removeItem('forgot-password');
        void navigate('/login');
      });
  };

  const handleUpdateForm = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;

    dispatch(updateForm({ name: name as TFormField, value }));
  };

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-medium">Восстановление пароля</h1>
      <form onSubmit={handleSubmitForm} className={styles.form}>
        <Input
          name={'password'}
          placeholder={'Введите новый пароль'}
          value={form.password}
          onChange={handleUpdateForm}
        />
        <Input
          name={'token'}
          placeholder={'Введите код из письма'}
          value={form.token}
          onChange={handleUpdateForm}
        />

        <Button htmlType={'submit'}>Сохранить</Button>
      </form>
      <footer className={styles.footer}>
        <p className="text text_type_main-default text_color_inactive">
          Вспомнили пароль?
        </p>{' '}
        <Link to={'/login'}>Войти</Link>
      </footer>
    </section>
  );
};
