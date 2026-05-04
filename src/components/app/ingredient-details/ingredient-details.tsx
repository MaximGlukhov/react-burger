import styles from './ingredient-details.module.css';

type TIngredientDetails = {
  imageSrc: string;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
};

export const IngredientDetails = ({
  imageSrc,
  name,
  calories,
  proteins,
  fat,
  carbohydrates,
}: TIngredientDetails): React.JSX.Element => {
  return (
    <div className={styles.ingredient}>
      <img className={styles.image} src={imageSrc} alt={name} />
      <p className="text text_type_main-medium mb-8">{name}</p>
      <ul className={styles.info}>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Калории,ккал</p>
          <p>{calories}</p>
        </li>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Белки, г</p>
          <p>{proteins}</p>
        </li>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Жиры, г</p>
          <p>{fat}</p>
        </li>
        <li className="text text_type_main-default text_color_inactive">
          <p className="mb-2">Углеводы, г</p>
          <p>{carbohydrates}</p>
        </li>
      </ul>
    </div>
  );
};
