import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';

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

  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = (): void => {
      const containerTop = container.getBoundingClientRect().top;

      const bunTop = Math.abs(
        (bun.current?.getBoundingClientRect().top ?? 0) - containerTop
      );

      const mainTop = Math.abs(
        (main.current?.getBoundingClientRect().top ?? 0) - containerTop
      );

      const sauceTop = Math.abs(
        (sauce.current?.getBoundingClientRect().top ?? 0) - containerTop
      );

      const min = Math.min(bunTop, mainTop, sauceTop);

      switch (min) {
        case bunTop:
          setActiveTab('bun');
          break;

        case mainTop:
          setActiveTab('main');
          break;

        case sauceTop:
          setActiveTab('sauce');
          break;
      }
    };

    container.addEventListener('scroll', handleScroll);

    return (): void => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

      <div ref={containerRef} className={`${styles.ingredients} custom-scroll`}>
        <h3 ref={bun} className="text text_type_main-medium mt-10 mb-6">
          Булки
        </h3>

        <ul className={`${styles.list} pl-4 pr-4`}>
          {buns.map((ingredient) => (
            <li key={ingredient._id}>
              <IngredientCard ingredientData={ingredient} />
            </li>
          ))}
        </ul>

        <h3 ref={main} className="text text_type_main-medium mt-10 mb-6">
          Начинки
        </h3>

        <ul className={`${styles.list} pl-4 pr-4`}>
          {mains.map((ingredient) => (
            <li key={ingredient._id}>
              <IngredientCard ingredientData={ingredient} />
            </li>
          ))}
        </ul>

        <h3 ref={sauce} className="text text_type_main-medium mt-10 mb-6">
          Соусы
        </h3>

        <ul className={`${styles.list} pl-4 pr-4`}>
          {sauces.map((ingredient) => (
            <li key={ingredient._id}>
              <IngredientCard ingredientData={ingredient} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
