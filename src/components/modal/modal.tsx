import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModal = {
  title?: string;
  children?: ReactNode | ReactNode[] | string;
  closePopup: () => void;
};

export const Modal = ({ title, children, closePopup }: TModal): React.JSX.Element => {
  const modalContainer = document.querySelector('#react-modals')!;

  useEffect(() => {
    const keyPressHandler = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && closePopup !== undefined) {
        closePopup();
      }
    };

    document.addEventListener('keydown', keyPressHandler);
    document.addEventListener('keyup', keyPressHandler);

    return (): void => {
      document.removeEventListener('keydown', keyPressHandler);
      document.removeEventListener('keyup', keyPressHandler);
    };
  }, [closePopup]);

  return createPortal(
    <>
      <ModalOverlay closePopup={closePopup} />
      <section onClick={(e) => e.stopPropagation()} className={styles.modal}>
        <header className={styles.header}>
          {title && <h2 className="text text_type_main-medium">{title}</h2>}
          <CloseIcon className={styles.close} onClick={closePopup} type={'primary'} />
        </header>
        <div className={styles.content}>{children}</div>
      </section>
    </>,
    modalContainer
  );
};
