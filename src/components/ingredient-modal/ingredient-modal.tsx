import { useDispatch, useSelector } from '@/services/hooks';
import { useGetIngredientsQuery } from '@/services/slices/api/api';
import {
  getOpenModal,
  setIngredientDetail,
  setOpenModal,
} from '@/services/slices/ingredient-detail/ingredient-detail-slice';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

export const IngredientModal = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const openModal = useSelector(getOpenModal);
  const { data: ingredients } = useGetIngredientsQuery();

  const navigate = useNavigate();
  const { id } = useParams();

  const hideModal = (): void => {
    dispatch(setOpenModal(false));
    dispatch(setIngredientDetail(null));
    void navigate(-1);
  };

  useEffect(() => {
    const findIngredient = ingredients?.data.find((item) => item._id === id);

    if (!findIngredient) return;

    dispatch(setIngredientDetail(findIngredient));
    dispatch(setOpenModal(true));
  }, []);

  if (!openModal) return null;

  return (
    <Modal closePopup={hideModal} title={'Детали ингредиента'}>
      <IngredientDetails />
    </Modal>
  );
};
