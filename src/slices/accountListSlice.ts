// src/slices/accountListSlice.ts
import createGenericListSlice from './entityListSlice';
import {  Entity } from './entityListSlice';


const {
    slice: accountListSlice,
    fetchEntities: fetchAccounts,
    deleteEntity: deleteAccount,
    actions,
} = createGenericListSlice<Entity>('accounts', '/account', 10);


export const { setCurrentPage, setLimit, clearError } = actions;
export { fetchAccounts, deleteAccount,  };
export default accountListSlice.reducer;