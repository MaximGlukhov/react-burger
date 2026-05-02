import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card.tsx';

import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState('bun');

  const bun = useRef<HTMLHeadingElement>(null);
  const main = useRef<HTMLHeadingElement>(null);
  const sauce = useRef<HTMLHeadingElement>(null);

  const sectionsRef = {
    bun,
    main,
    sauce,
  };

  const handleChangeTab = (value: string): void => {
    setActiveTab(value);

    const ref = sectionsRef[value as keyof typeof sectionsRef];
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const buns = useMemo(() => {
    return ingredients.filter((item) => item.type === 'bun');
  }, [ingredients]);

  const mains = useMemo(() => {
    return ingredients.filter((item) => item.type === 'main');
  }, [ingredients]);

  const sauces = useMemo(() => {
    return ingredients.filter((item) => item.type === 'sauce');
  }, [ingredients]);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={activeTab === 'bun'} onClick={handleChangeTab}>
            Булки
          </Tab>

          <Tab value="main" active={activeTab === 'main'} onClick={handleChangeTab}>
            Начинки
          </Tab>
          <Tab value="sauce" active={activeTab === 'sauce'} onClick={handleChangeTab}>
            Соусы
          </Tab>
        </ul>
      </nav>

      <div className={`${styles.ingredients} custom-scroll`}>
        <h3 ref={bun} className="text text_type_main-medium mt-10 mb-6">
          Булки
        </h3>
        <ul className={`${styles.list} pl-4 pr-4`}>
          {buns.map((ingredient) => (
            <li key={ingredient._id}>
              <IngredientCard count={1} ingredientData={ingredient} />
            </li>
          ))}
        </ul>

        <h3 ref={main} className="text text_type_main-medium mt-10 mb-6">
          Начинки
        </h3>
        <ul className={`${styles.list} pl-4 pr-4`}>
          {mains.map((ingredient) => (
            <li key={ingredient._id}>
              <IngredientCard count={1} ingredientData={ingredient} />
            </li>
          ))}
        </ul>

        <h3 ref={sauce} className="text text_type_main-medium mt-10 mb-6">
          Соусы
        </h3>
        <ul className={`${styles.list} pl-4 pr-4`}>
          {sauces.map((ingredient) => (
            <li key={ingredient._id}>
              <IngredientCard count={1} ingredientData={ingredient} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
