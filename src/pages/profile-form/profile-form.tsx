import { useSelector } from '@/services/hooks';
import { useUpdateUserMutation } from '@/services/slices/api/authApi';
import { getUser } from '@/services/slices/user/user';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import {
  useEffect,
  useReducer,
  useState,
  type ChangeEvent,
  type FormEventHandler,
} from 'react';

import styles from './profile-form.module.css';

type FormState = {
  name: string;
  email: string;
  password: string;
};

type FormAction =
  | {
      type: 'UPDATE_FIELD';
      field: keyof FormState;
      value: string;
    }
  | {
      type: 'SET_INITIAL_DATA';
      payload: Partial<FormState>;
    };

const initialState: FormState = {
  name: '',
  email: '',
  password: '',
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };

    case 'SET_INITIAL_DATA':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export const ProfileForm = (): React.JSX.Element => {
  const user = useSelector(getUser);

  const [submit, { isLoading }] = useUpdateUserMutation();

  const [formData, dispatch] = useReducer(formReducer, initialState);

  const [updateData, setUpdateData] = useState(false);

  const updateForm = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.currentTarget;

    dispatch({
      type: 'UPDATE_FIELD',
      field: name as keyof FormState,
      value,
    });

    setUpdateData(true);
  };

  const handleCancel = (): void => {
    setUpdateData(false);
    if (user) {
      dispatch({
        type: 'SET_INITIAL_DATA',
        payload: {
          name: user.name,
          email: user.email,
        },
      });
    }
  };

  const handleSubmitForm: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    void submit(formData);
  };

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'SET_INITIAL_DATA',
        payload: {
          name: user.name,
          email: user.email,
        },
      });
    }
  }, [user]);

  return (
    <form onSubmit={handleSubmitForm} className={styles.form}>
      <Input name="name" placeholder="Имя" value={formData.name} onChange={updateForm} />

      <Input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={updateForm}
      />

      <Input
        name="password"
        placeholder="Пароль"
        type="password"
        value={formData.password}
        onChange={updateForm}
      />

      {updateData && (
        <div className={styles.footer}>
          <Button onClick={handleCancel} htmlType={'reset'}>
            Отменить
          </Button>
          <Button disabled={isLoading} htmlType={'submit'}>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
