// src/features/account/api.ts
import api from '../../services/api';
import { AccountPaginatedResponse, Account } from './types';
import { logger } from '../../utils/logger';

const fetchAccounts = async (params: { page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<AccountPaginatedResponse> => {
    const response = await api.get('/account/list', {params});
    return response.data.data;
};

const createAccount = async (data: Account): Promise<Account> => {
    const response = await api.post(`/account/create`, data);
    return response.data.data;
};

const updateAccount = async (id: string, data: Account): Promise<Account> => {
    const response = await api.put(`/account/${id}/update`, data);
    return response.data.data
}

const fetchAccount = async (id: string): Promise<Account> => {
    const response = await api.get(`/account/${id}/view`);
    return response.data.data;
}

const deleteAccount = async (id: string) : Promise<string> => {
  await api.delete(`/account/${id}`);
  return id
}

export const accountApi = {
    fetchAccounts,
    createAccount,
    updateAccount,
    fetchAccount,
    deleteAccount
}