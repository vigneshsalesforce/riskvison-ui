// src/features/common/hooks/useObjectDefinitionApi.ts
import { useQuery } from 'react-query';
import api from '../../../services/api';
import { ObjectDefinition } from '../../../types';
import { logger } from '../../../utils/logger';

const fetchObjectDefinition = async (name: string): Promise<ObjectDefinition> => {
    const response = await api.get(`/object/${name}`);
    return response.data.data;
};

const useObjectDefinitionApi = (name:string) => {
    const { data, isLoading, error } = useQuery(
        ['objectDefinition', name],
        () => fetchObjectDefinition(name),
        {
          onError: (err:any) => {
            logger.error("Error in fetching object definition", err);
          }
        }
    );
    return {
        objectDefinition: data,
        isLoading,
        error,
    };
};

export default useObjectDefinitionApi;