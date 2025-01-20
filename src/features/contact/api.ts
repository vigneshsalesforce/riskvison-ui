// src/features/contact/api.ts
import api from '../../services/api';
import { ContactPaginatedResponse, Contact } from './types';
import { logger } from '../../utils/logger';

const fetchContacts = async (params: { page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<ContactPaginatedResponse> => {
    const response = await api.get('/contact/list', {params});
    return response.data.data;
};

const createContact = async (data: Contact): Promise<Contact> => {
    const response = await api.post(`/contact/create`, data);
    return response.data.data;
};

const updateContact = async (id: string, data: Contact): Promise<Contact> => {
    const response = await api.put(`/contact/${id}/update`, data);
    return response.data.data
}

const fetchContact = async (id: string): Promise<Contact> => {
    const response = await api.get(`/contact/${id}/view`);
    return response.data.data;
}

const deleteContact = async (id: string) : Promise<string> => {
  await api.delete(`/contact/${id}`);
  return id
}

export const contactApi = {
    fetchContacts,
    createContact,
    updateContact,
    fetchContact,
    deleteContact
}