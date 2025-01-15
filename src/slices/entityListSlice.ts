// src/slices/entityListSlice.ts

import { createSlice, createAsyncThunk, PayloadAction, Draft } from '@reduxjs/toolkit';
import api from '../services/api';
import { RootState } from '../store';

interface Entity {
    _id: string;
    [key: string]: any;
}

interface EntityListState<T extends Entity> {
    items: T[];
    loading: boolean;
    error: string | null;
    deleteLoading: Record<string, boolean>;
    pagination: {
      currentPage: number;
      totalPages: number;
      limit: number;
    };
}

// Create a type that can be assigned to each async thunk parameter
type AsyncThunkParams<T extends Entity> = {
    page: number;
    search?: string;
} & (T extends Entity ? { id?: T['_id'], data?: Partial<T> } : {});


// Helper function to generate initial state
const createInitialState = <T extends Entity>(initialLimit: number): EntityListState<T> => ({
    items: [],
    loading: false,
    error: null,
    deleteLoading: {},
    pagination: {
      currentPage: 1,
      totalPages: 1,
      limit: initialLimit,
    }
});

// Helper function to generate the action type prefixes
const createActionPrefix = (entityName: string) => {
    return  `entityList/${entityName}`;
}

const createGenericListSlice = <T extends Entity>(
    entityName: string,
    endpoint: string,
     initialLimit = 10
    ) => {

    const initialState = createInitialState<T>(initialLimit);
    const actionPrefix = createActionPrefix(entityName);


    const fetchEntities = createAsyncThunk<
        { data: T[]; pagination?: { totalPages: number } },
        AsyncThunkParams<T>,
        { state: RootState }
    >(
        `${actionPrefix}/fetchEntities`,
        async ({ page, search }: { page: number, search?: string }) => {
          const response = await api.get(`${endpoint}/list`, {
              params: { page, limit: initialState.pagination.limit, search },
          })
          return response.data.data;
        }
    );

    const deleteEntity = createAsyncThunk<
        string,
       string,
        { state: RootState }
    >(
        `${actionPrefix}/deleteEntity`,
        async (id: string) => {
            await api.delete(`${endpoint}/${id}`);
            return id;
        }
    );



    const entityListSlice = createSlice({
        name: entityName,
        initialState,
        reducers: {
             setCurrentPage: (state, action:PayloadAction<number>) => {
               state.pagination.currentPage = action.payload
            },
             setLimit: (state, action:PayloadAction<number>) => {
              state.pagination.limit = action.payload;
              state.pagination.currentPage = 1; // Reset page on limit change
            },
            clearError: (state) => {
               state.error = null;
           }
        },
        extraReducers: (builder) => {
            builder
                .addCase(fetchEntities.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchEntities.fulfilled, (state, action) => {
                    state.loading = false;
                    state.items = Array.isArray(action.payload.data) ? action.payload.data as Draft<T>[] : [];
                  state.pagination.totalPages = action.payload.pagination?.totalPages || 1;
                })
                .addCase(fetchEntities.rejected, (state, action) => {
                    state.loading = false;
                     state.error = action.error.message || "Error fetching entities";
                    state.items = [];
                })
                .addCase(deleteEntity.pending, (state, action) => {
                    state.deleteLoading[action.meta.arg] = true;
                     state.error = null;
                })
                .addCase(deleteEntity.fulfilled, (state, action) => {
                    delete state.deleteLoading[action.payload];
                    state.items = state.items.filter((item) => item._id !== action.payload);
                })
                 .addCase(deleteEntity.rejected, (state, action) => {
                    state.deleteLoading = {};
                    state.error = action.error.message || "Error deleting entity";
                })
        },
    });

    return {
        slice: entityListSlice,
        fetchEntities,
        deleteEntity,
        actions: entityListSlice.actions,
    };
};

export default createGenericListSlice;