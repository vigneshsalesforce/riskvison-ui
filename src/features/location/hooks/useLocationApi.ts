// src/features/location/hooks/useLocationApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { locationApi } from '../api';
import { Location } from '../types';
import { logger } from '../../../utils/logger';

const useLocationApi = () => {
    const queryClient = useQueryClient();
    const fetch = (params: {page: number, limit: number, search?:string, sortBy?:string, sortOrder?: 'asc'|'desc'}) => useQuery(['locations', params], () => locationApi.fetchLocations(params), {
        onError: (error:any) => {
            logger.error("Error fetching location:", error)
        }
    });
    const get = (id: string) => useQuery(['location', id], () => locationApi.fetchLocation(id), {
        enabled: !!id,
        onError: (error:any) => {
            logger.error("Error fetching single location:", error)
        }
    });
     const create = useMutation(locationApi.createLocation, {
        onSuccess: () => {
          queryClient.invalidateQueries('locations');
        },
         onError: (error:any) => {
             logger.error("Error creating location:", error)
         }
      });
    const update = useMutation( ({id, data}: {id:string, data:Location}) => locationApi.updateLocation(id, data), {
      onSuccess: () => {
          queryClient.invalidateQueries('locations');
      },
      onError: (error:any) => {
           logger.error("Error updating location:", error)
       }
    })
    const remove = useMutation(locationApi.deleteLocation, {
      onSuccess: () => {
        queryClient.invalidateQueries('locations');
      },
       onError: (error:any) => {
           logger.error("Error deleting location:", error)
       }
    });
    return {
        fetchLocations: fetch,
        createLocation: create,
        updateLocation: update,
        getLocation: get,
        deleteLocation: remove
    };
};

export default useLocationApi;