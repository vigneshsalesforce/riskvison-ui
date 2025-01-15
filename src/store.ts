// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import accountListReducer from './slices/accountListSlice';
import { slice as accountSlice} from './slices/entityListSlice'
const store = configureStore({
    reducer: {
        accounts: accountListReducer,
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;