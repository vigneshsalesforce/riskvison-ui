// src/features/building/hooks/useBuildingApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { buildingApi } from '../api';
import { Building } from '../types';
import { logger } from '../../../utils/logger';

const useBuildingApi = () => {
    const queryClient = useQueryClient();
    const fetch = (params: {page: number, limit: number, search?:string, sortBy?:string, sortOrder?: 'asc'|'desc'}) => useQuery(['buildings', params], () => buildingApi.fetchBuildings(params), {
        onError: (error:any) => {
            logger.error("Error fetching building:", error)
        }
    });
    const get = (id: string) => useQuery(['building', id], () => buildingApi.fetchBuilding(id), {
        enabled: !!id,
        onError: (error:any) => {
            logger.error("Error fetching single building:", error)
        }
    });
     const create = useMutation(buildingApi.createBuilding, {
        onSuccess: () => {
          queryClient.invalidateQueries('buildings');
        },
         onError: (error:any) => {
             logger.error("Error creating building:", error)
         }
      });
    const update = useMutation( ({id, data}: {id:string, data:Building}) => buildingApi.updateBuilding(id, data), {
      onSuccess: () => {
          queryClient.invalidateQueries('buildings');
      },
      onError: (error:any) => {
           logger.error("Error updating building:", error)
       }
    })
    const remove = useMutation(buildingApi.deleteBuilding, {
      onSuccess: () => {
        queryClient.invalidateQueries('buildings');
      },
       onError: (error:any) => {
           logger.error("Error deleting building:", error)
       }
    });
    return {
        fetchBuildings: fetch,
        createBuilding: create,
        updateBuilding: update,
        getBuilding: get,
        deleteBuilding: remove
    };
};

export default useBuildingApi;