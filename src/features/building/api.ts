// src/features/building/api.ts
import api from '../../services/api';
import { BuildingPaginatedResponse, Building } from './types';
import { logger } from '../../utils/logger';

const fetchBuildings = async (params: { page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<BuildingPaginatedResponse> => {
    const response = await api.get('/building/list', {params});
    return response.data.data;
};

const createBuilding = async (data: Building): Promise<Building> => {
    const response = await api.post(`/building/create`, data);
    return response.data.data;
};

const updateBuilding = async (id: string, data: Building): Promise<Building> => {
    const response = await api.put(`/building/${id}/update`, data);
    return response.data.data
}

const fetchBuilding = async (id: string): Promise<Building> => {
    const response = await api.get(`/building/${id}/view`);
    return response.data.data;
}

const deleteBuilding = async (id: string) : Promise<string> => {
  await api.delete(`/building/${id}`);
  return id
}

export const buildingApi = {
    fetchBuildings,
    createBuilding,
    updateBuilding,
    fetchBuilding,
    deleteBuilding
}