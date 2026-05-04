import { ingredientsUrl } from '@/utils/const';
import { useEffect, useState } from 'react';

import type { TIngredient } from '@/utils/types';

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const useGetIngredients = (): [TIngredient[] | null, string | null, boolean] => {
  const [ingredients, setIngredients] = useState<TIngredient[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(ingredientsUrl)
      .then((res) => {
        return res.json();
      })
      .then((res: TIngredientsResponse) => {
        setIngredients(res.data);
      })
      .catch((err) => {
        setError(String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return [ingredients, error, loading];
};
