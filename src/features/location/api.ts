// src/features/location/api.ts
import api from '../../services/api';
import { LocationPaginatedResponse, Location } from './types';
import { logger } from '../../utils/logger';

const fetchLocations = async (params: { page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<LocationPaginatedResponse> => {
    const response = await api.get('/location/list', {params});
    return response.data.data;
};

const createLocation = async (data: Location): Promise<Location> => {
    const response = await api.post(`/location/create`, data);
    return response.data.data;
};

const updateLocation = async (id: string, data: Location): Promise<Location> => {
    const response = await api.put(`/location/${id}/update`, data);
    return response.data.data
}

const fetchLocation = async (id: string): Promise<Location> => {
    const response = await api.get(`/location/${id}/view`);
    return response.data.data;
}

const deleteLocation = async (id: string) : Promise<string> => {
  await api.delete(`/location/${id}`);
  return id
}

export const locationApi = {
    fetchLocations,
    createLocation,
    updateLocation,
    fetchLocation,
    deleteLocation
}