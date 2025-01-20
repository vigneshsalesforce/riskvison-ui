// src/redux/rootReducer.ts

import { combineReducers } from 'redux';
import toastReducer from './toastSlice';

const rootReducer = combineReducers({
  toast: toastReducer
});

export default rootReducer;