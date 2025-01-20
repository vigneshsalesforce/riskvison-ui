// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import accountListReducer from './slices/accountListSlice';

const store = configureStore({
    reducer: {
        accountList: accountListReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;