// src/features/pra/api.ts
import api from '../../services/api';
import { PropertyRiskAssessmentPaginatedResponse, PropertyRiskAssessment, WizardObjectDefinition } from './types';
import { logger } from '../../utils/logger';

const fetchPropertyRiskAssessments = async (params: { page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc'|'desc' }): Promise<PropertyRiskAssessmentPaginatedResponse> => {
    const response = await api.get('/brewerySiteInspection/list', {params});
        return response.data.data.data;
};

const createPropertyRiskAssessment = async (data: PropertyRiskAssessment): Promise<PropertyRiskAssessment> => {
    const response = await api.post(`/brewerySiteInspection/create`, data);
    return response.data.data;
};

const updatePropertyRiskAssessment = async (id: string, data: PropertyRiskAssessment): Promise<PropertyRiskAssessment> => {
    const response = await api.put(`/brewerySiteInspection/${id}/update`, data);
    return response.data.data
}

const fetchPropertyRiskAssessment = async (id: string): Promise<PropertyRiskAssessment> => {
    const response = await api.get(`/brewerySiteInspection/${id}/view`);
    return response.data.data;
}

const deletePropertyRiskAssessment = async (id: string) : Promise<string> => {
  await api.delete(`/brewerySiteInspection/${id}`);
  return id
}


export const praApi = {
    fetchPropertyRiskAssessments,
    createPropertyRiskAssessment,
    updatePropertyRiskAssessment,
    fetchPropertyRiskAssessment,
    deletePropertyRiskAssessment,
}