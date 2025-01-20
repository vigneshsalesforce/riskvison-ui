// src/features/common/hooks/useWizardObjectDefinitionApi.ts
import { useQuery } from 'react-query';
import api from '../../../services/api';
import { WizardObjectDefinition } from '../../pra/types';
import { logger } from '../../../utils/logger';

const fetchWizardObjectDefinition = async (objectName: string): Promise<WizardObjectDefinition> => {
    const response = await api.get(`/wizard/${objectName}`);
     return response.data.data;
};

const useWizardObjectDefinitionApi = (objectName: string) => {
    return useQuery(['wizardObjectDefinition', objectName], () => fetchWizardObjectDefinition(objectName), {
        enabled: !!objectName,
        onError: (error:any) => {
            logger.error("Error fetching wizard object definition:", error)
        }
    });
};

export default useWizardObjectDefinitionApi;