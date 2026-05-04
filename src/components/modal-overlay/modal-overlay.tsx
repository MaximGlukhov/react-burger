import styles from './modal-overlay.module.css';

type TModalOverlay = {
  closePopup: () => void;
};

export const ModalOverlay = ({ closePopup }: TModalOverlay): React.JSX.Element => {
  const handleClickOverlay = (): void => {
    closePopup?.();
  };

  return <div className={styles.modalOverlay} onClick={handleClickOverlay}></div>;
};
