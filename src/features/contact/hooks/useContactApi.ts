// src/features/contact/hooks/useContactApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { contactApi } from '../api';
import { Contact } from '../types';
import { logger } from '../../../utils/logger';

const useContactApi = () => {
    const queryClient = useQueryClient();
    const fetch = (params: {page: number, limit: number, search?:string, sortBy?:string, sortOrder?: 'asc'|'desc'}) => useQuery(['contacts', params], () => contactApi.fetchContacts(params), {
        onError: (error:any) => {
            logger.error("Error fetching contact:", error)
        }
    });
    const get = (id: string) => useQuery(['contact', id], () => contactApi.fetchContact(id), {
        enabled: !!id,
        onError: (error:any) => {
            logger.error("Error fetching single contact:", error)
        }
    });
     const create = useMutation(contactApi.createContact, {
        onSuccess: () => {
          queryClient.invalidateQueries('contacts');
        },
         onError: (error:any) => {
             logger.error("Error creating contact:", error)
         }
      });
    const update = useMutation( ({id, data}: {id:string, data:Contact}) => contactApi.updateContact(id, data), {
      onSuccess: () => {
          queryClient.invalidateQueries('contacts');
      },
      onError: (error:any) => {
           logger.error("Error updating contact:", error)
       }
    })
    const remove = useMutation(contactApi.deleteContact, {
      onSuccess: () => {
        queryClient.invalidateQueries('contacts');
      },
       onError: (error:any) => {
           logger.error("Error deleting contact:", error)
       }
    });
    return {
        fetchContacts: fetch,
        createContact: create,
        updateContact: update,
        getContact: get,
        deleteContact: remove
    };
};

export default useContactApi;