import { useSelector } from '@/services/hooks';
import { getIngredientDetail } from '@/services/slices/ingredient-detail/ingredient-detail-slice';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element => {
  const details = useSelector(getIngredientDetail);

  return (
    <div className={styles.ingredient}>
      <img className={styles.image} src={details?.image_large} alt={details?.name} />
      <p className="text text_type_main-medium mb-8">{details?.name}</p>
      <ul className={styles.info}>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Калории,ккал</p>
          <p>{details?.calories}</p>
        </li>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Белки, г</p>
          <p>{details?.proteins}</p>
        </li>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Жиры, г</p>
          <p>{details?.fat}</p>
        </li>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Углеводы, г</p>
          <p>{details?.carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
};
