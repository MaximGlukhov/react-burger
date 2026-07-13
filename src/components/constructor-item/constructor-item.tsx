import { useDispatch } from '@/services/hooks';
import {
  moveIngredient,
  removeIngredient,
  type TUniqIngredient,
} from '@/services/slices/burger-constructor/burger-constructor-slice';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import styles from './constuctor-element.module.css';

type TConstructorItemProps = {
  ingredient: TUniqIngredient;
  index: number;
  length: number;
  order: number | undefined;
};

type TDragItem = {
  index: number;
};

export const ConstructorItem = ({
  ingredient,
  index,
  length,
  order,
}: TConstructorItemProps): React.JSX.Element => {
  const dispatch = useDispatch();

  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop<TDragItem>({
    accept: 'sort-ingredient',

    hover(item) {
      if (!ref.current) return;

      if (item.index === index) return;

      dispatch(
        moveIngredient({
          dragIndex: item.index,
          hoverIndex: index,
        })
      );

      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'sort-ingredient',

    canDrag: ingredient.type !== 'bun',

    item: {
      index,
    },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      data-testid={`constructor-item-${ingredient.uniqId}`}
      ref={ref}
      className={styles.item}
      style={{
        opacity: isDragging ? 0.5 : 1,
        order: order,
        cursor: ingredient.type !== 'bun' ? 'grab' : 'default',
      }}
    >
      {ingredient.type !== 'bun' && <DragIcon type={'primary'} />}
      <ConstructorElement
        handleClose={() => dispatch(removeIngredient(ingredient))}
        isLocked={ingredient.type === 'bun'}
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
        type={
          index === 0 && ingredient.type === 'bun'
            ? 'top'
            : index === length - 1 && ingredient.type === 'bun'
              ? 'bottom'
              : undefined
        }
      />
    </li>
  );
};
