import { useDispatch, useSelector } from '@/services/hooks';
import { useRegisterMutation } from '@/services/slices/api/authApi';
import {
  getForm,
  updateForm,
  type TFormField,
} from '@/services/slices/registration/registration-slice';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { ChangeEvent, FormEventHandler } from 'react';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const [submitRegistration, { isLoading }] = useRegisterMutation();
  const form = useSelector(getForm);

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void submitRegistration(form);
  };

  const handleUpdateForm = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;

    dispatch(updateForm({ name: name as TFormField, value }));
  };

  return (
    <section className={styles.section}>
      <h1 className="text text_type_main-medium">Регистрация</h1>
      <form onSubmit={handleSubmitForm} className={styles.form}>
        <Input
          name={'name'}
          placeholder={'Имя'}
          value={form.name}
          onChange={handleUpdateForm}
        />
        <Input
          name={'email'}
          placeholder={'E-mail'}
          value={form.email}
          onChange={handleUpdateForm}
        />
        <Input
          name={'password'}
          placeholder={'Пароль'}
          type={'password'}
          value={form.password}
          onChange={handleUpdateForm}
        />
        <Button disabled={isLoading} htmlType={'submit'}>
          Зарегистрироваться
        </Button>
      </form>
      <footer className={styles.footer}>
        <p className="text text_type_main-default text_color_inactive">
          Уже зарегистрированы?
        </p>{' '}
        <Link to={'/login'}>Войти</Link>
      </footer>
    </section>
  );
};
