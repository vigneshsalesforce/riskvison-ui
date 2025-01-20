// src/slices/accountListSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface Account {
    _id: string;
    Name: string;
    address: string;
    contact: string;
}

interface AccountListState {
    accounts: Account[];
    loading: boolean;
    searchTerm: string;
    currentPage: number;
    totalPages: number;
    error: string | null;
    deleteLoading: string | null;
}

const initialState: AccountListState = {
    accounts: [],
    loading: false,
    searchTerm: "",
    currentPage: 1,
    totalPages: 1,
    error: null,
    deleteLoading: null
};

export const fetchAccounts = createAsyncThunk(
    'accountList/fetchAccounts',
    async ({ page, search }: { page: number, search: string }) => {
        const response = await api.get("/account/list", {
            params: { page, limit: 10, search },
        });
        return response.data.data;
    }
);

export const deleteAccount = createAsyncThunk(
    'accountList/deleteAccount',
    async (id: string) => {
        await api.delete(`/account/${id}`);
        return id
    }
);


const accountListSlice = createSlice({
    name: 'accountList',
    initialState,
    reducers: {
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
            state.currentPage = 1;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
                 state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = Array.isArray(action.payload.data) ? action.payload.data : [];
                state.totalPages = action.payload.pagination?.totalPages || 1;
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                 state.error = action.error.message || "Error fetching accounts";
                state.accounts = [];
            })
            .addCase(deleteAccount.pending, (state, action) => {
                state.deleteLoading = action.meta.arg;
                 state.error = null;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.deleteLoading = null;
                state.accounts = state.accounts.filter((account) => account._id !== action.payload);
            })
             .addCase(deleteAccount.rejected, (state, action) => {
                state.deleteLoading = null;
                 state.error = action.error.message || "Error deleting account";
            })
    },
});

export const { setSearchTerm, setCurrentPage } = accountListSlice.actions;

export default accountListSlice.reducer;