// src/features/pra/hooks/usePraApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { praApi } from '../api';
import { PropertyRiskAssessment, WizardObjectDefinition } from '../types';
import { logger } from '../../../utils/logger';
import useWizardObjectDefinitionApi from '../../common/hooks/useWizardObjectDefinitionApi';

const usePraApi = () => {
    const queryClient = useQueryClient();
    const fetch = (params: {page: number, limit: number, search?:string, sortBy?:string, sortOrder?: 'asc'|'desc'}) => useQuery(['propertyRiskAssessments', params], () => praApi.fetchPropertyRiskAssessments(params), {
        onError: (error:any) => {
            logger.error("Error fetching property risk assessments:", error)
        }
    });
    const get = (id: string) => useQuery(['propertyRiskAssessment', id], () => praApi.fetchPropertyRiskAssessment(id), {
        enabled: !!id,
        onError: (error:any) => {
            logger.error("Error fetching single property risk assessment:", error)
        }
    });
     const create = useMutation(praApi.createPropertyRiskAssessment, {
        onSuccess: () => {
          queryClient.invalidateQueries('propertyRiskAssessments');
        },
         onError: (error:any) => {
             logger.error("Error creating property risk assessment:", error)
         }
      });
    const update = useMutation( ({id, data}: {id:string, data:PropertyRiskAssessment}) => praApi.updatePropertyRiskAssessment(id, data), {
      onSuccess: () => {
          queryClient.invalidateQueries('propertyRiskAssessments');
      },
      onError: (error:any) => {
           logger.error("Error updating property risk assessment:", error)
       }
    })
    const remove = useMutation(praApi.deletePropertyRiskAssessment, {
      onSuccess: () => {
        queryClient.invalidateQueries('propertyRiskAssessments');
      },
       onError: (error:any) => {
           logger.error("Error deleting property risk assessment:", error)
       }
    });
 const getWizardObjectDefinition = useWizardObjectDefinitionApi;
    return {
        fetchPropertyRiskAssessments: fetch,
        createPropertyRiskAssessment: create,
        updatePropertyRiskAssessment: update,
        getPropertyRiskAssessment: get,
        deletePropertyRiskAssessment: remove,
      getWizardObjectDefinition
    };
};

export default usePraApi;