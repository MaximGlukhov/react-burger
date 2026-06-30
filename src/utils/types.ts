export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TOrder = {
  createdAt: string;
  ingredients: string[];
  name: string;
  number: number;
  status: string;
  updatedAt: string;
  _id: string;
};

export type TIngredientTransform = {
  count: number;
} & TIngredient;

export type TOrederTransform = {
  createdAt: string;
  ingredients: TIngredientTransform[];
  name: string;
  number: number;
  status: string;
  updatedAt: string;
  _id: string;
};
