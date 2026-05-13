import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '.';
import type { TypedUseSelectorHook } from 'react-redux';

const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useAppDispatch as useDispatch, useAppSelector as useSelector };
