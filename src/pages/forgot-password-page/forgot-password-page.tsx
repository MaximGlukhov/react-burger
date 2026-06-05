import { useDispatch, useSelector } from '@/services/hooks';
import { useForgotPasswortMutation } from '@/services/slices/api/authApi';
import {
  getForm,
  updateForm,
  type TFormField,
} from '@/services/slices/forgot-password/forgot-password';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import type { ChangeEvent, FormEventHandler } from 'react';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const [forgotPassword] = useForgotPasswortMutation();
  const form = useSelector(getForm);
  const navigate = useNavigate();

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void forgotPassword(form.email)
      .unwrap()
      .then(() => {
        localStorage.setItem('forgot-password', 'true');
        void navigate('/reset-password');
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
          name={'email'}
          placeholder={'Укажите e-mail'}
          value={form.email}
          onChange={handleUpdateForm}
        />

        <Button htmlType={'submit'}>Восстановить</Button>
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
