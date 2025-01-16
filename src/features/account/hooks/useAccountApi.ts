// src/features/account/hooks/useAccountApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { accountApi } from '../api';
import { Account } from '../types';
import { logger } from '../../../utils/logger';

const useAccountApi = () => {
    const queryClient = useQueryClient();
    const fetch = (params: {page: number, limit: number, search?:string, sortBy?:string, sortOrder?: 'asc'|'desc'}) => useQuery(['accounts', params], () => accountApi.fetchAccounts(params), {
        onError: (error:any) => {
            logger.error("Error fetching account:", error)
        }
    });
    const get = (id: string) => useQuery(['account', id], () => accountApi.fetchAccount(id), {
        enabled: !!id,
        onError: (error:any) => {
            logger.error("Error fetching single account:", error)
        }
    });
     const create = useMutation(accountApi.createAccount, {
        onSuccess: () => {
          queryClient.invalidateQueries('accounts');
        },
         onError: (error:any) => {
             logger.error("Error creating account:", error)
         }
      });
    const update = useMutation( ({id, data}: {id:string, data:Account}) => accountApi.updateAccount(id, data), {
      onSuccess: () => {
          queryClient.invalidateQueries('accounts');
      },
      onError: (error:any) => {
           logger.error("Error updating account:", error)
       }
    })
    const remove = useMutation(accountApi.deleteAccount, {
      onSuccess: () => {
        queryClient.invalidateQueries('accounts');
      },
       onError: (error:any) => {
           logger.error("Error deleting account:", error)
       }
    });
    return {
        fetchAccounts: fetch,
        createAccount: create,
        updateAccount: update,
        getAccount: get,
        deleteAccount: remove
    };
};

export default useAccountApi;