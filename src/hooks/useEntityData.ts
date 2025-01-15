// src/hooks/useEntityData.ts

import { useState, useEffect, useRef, useCallback } from 'react';
import apiService from '../services/api';
import logger from '../utils/logger';
import { useToast } from '../components/Toast';

interface ObjectDefinition {
    name: string;
    label: string;
    fields: any[]; // Define the correct type for fields
}

interface UseEntityDataProps<T> {
    entityId?: string;
    objectName: string;
}



const useEntityData = <T extends Record<string, any>>({ objectName, entityId }:UseEntityDataProps<T>) => {
  const [entity, setEntity] = useState<T | null>(null);
  const [objectDefinition, setObjectDefinition] = useState<ObjectDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectDefinitionCache = useRef<Record<string, ObjectDefinition | null>>({});
  const lookupDataCache = useRef<Record<string, any[]>>({}); // Cache for lookup data
    const [lookupValues, setLookupValues] = useState<Record<string, any>>({});
    const { showToast } = useToast();

    const fetchLookups = useCallback(async (currentEntity: T | null , currentObjectDefinition: ObjectDefinition | null) => {
        if (!currentEntity || !currentObjectDefinition) return;

        const lookupFields = currentObjectDefinition.fields?.filter(
            (field) => field.type === "lookup" && field.options?.dynamic && currentEntity[field.name]
        ) || [];

        if (lookupFields.length === 0) {
            return;
        }

        const fetchLookupData = async (field: any) => {
            const { objectName, valueField } = field.options?.dynamic || {}
            if (!objectName || !valueField) {
                return [];
            }

            const cacheKey = `/${objectName}/list`

            if (lookupDataCache.current[cacheKey]) {
                return lookupDataCache.current[cacheKey];
            }

            try {
                const response = await apiService.get(cacheKey);
                if (response.data && response.data.data && response.data.data.data) {
                    lookupDataCache.current[cacheKey] = response.data.data.data;
                    return response.data.data.data;

                }
                return [];
            } catch (error: any) {
                logger.error(`Error fetching lookup data for ${objectName}:`, error);
                return [];
            }
        };

        const lookupResults = await Promise.all(lookupFields.map(fetchLookupData));

        const updatedLookupValues: Record<string, any> = {};
        lookupFields.forEach((field, index) => {
            const { displayField, valueField } = field.options?.dynamic || {};
            const lookupList = lookupResults[index] || [];
            const currentLookupId = currentEntity[field.name];
            if (currentLookupId && displayField) {
                const foundLookup = lookupList.find((item: any) => item[valueField] === currentLookupId);
                updatedLookupValues[field.name] = foundLookup ? foundLookup[displayField] : currentLookupId
            } else {
                updatedLookupValues[field.name] = currentLookupId;
            }
        });
         setLookupValues(updatedLookupValues);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showToast]);




  const fetchData = useCallback(async () => {
        setLoading(true);
      try {
          const definitionCacheKey = `/object/${objectName}`;
            let definitionData:ObjectDefinition | null = null;
            if (objectDefinitionCache.current[definitionCacheKey]) {
                definitionData = objectDefinitionCache.current[definitionCacheKey];
            } else {
                const definitionRes = await apiService.get(definitionCacheKey);
                definitionData = definitionRes.data;
                objectDefinitionCache.current[definitionCacheKey] = definitionData;
            }
            setObjectDefinition(definitionData);

            let entityData = null;
            if(entityId){
                 const entityRes = await apiService.get(`/${objectName}/${entityId}/view`);
                 entityData = entityRes.data;
            }
          setEntity(entityData);
          setError(null);
          await fetchLookups(entityData, definitionData)
      } catch (error: any) {
        logger.error(`Error fetching ${objectName} details:`, error);
          showToast('error', error.message || `Error fetching ${objectName} details`, 'Error');
        setError(error.message || `Error fetching ${objectName} details`);
      } finally {
          setLoading(false);
      }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, objectName, showToast]);

  useEffect(() => {
    fetchData();
   }, [fetchData])


    const clearError = () => {
        setError(null);
    };

  return {
    entity,
    objectDefinition,
    loading,
      error,
      clearError,
        lookupValues,
  };
};

export default useEntityData;