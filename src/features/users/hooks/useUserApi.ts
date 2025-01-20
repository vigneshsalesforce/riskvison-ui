// src/features/users/hooks/useUserApi.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import userService from '../../../services/userService';
import { logger } from '../../../utils/logger';

interface User {
  _id?: string;
  name: string;
  email: string;
  profile: string;
}

const useUserApi = () => {
    const queryClient = useQueryClient();

    const fetch = (params: { page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc' }) =>
    useQuery(['users', params], () => userService.fetchUsers(params), {
        onError: (error: any) => {
            logger.error("Error fetching users:", error)
        }
    });

    const get = (id: string) => useQuery(['user', id], () => userService.fetchUser(id), {
        enabled: !!id,
        onError: (error: any) => {
            logger.error("Error fetching single user:", error)
        }
    });

    const create = useMutation(userService.createUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
        onError: (error: any) => {
            logger.error("Error creating user:", error)
        }
    });

    const update = useMutation(({ id, data }: { id: string, data: User }) => userService.updateUser(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
        onError: (error: any) => {
            logger.error("Error updating user:", error)
        }
    });

    const remove = useMutation(userService.deleteUser, {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
        onError: (error: any) => {
            logger.error("Error deleting user:", error)
        }
    });
     const profiles = () => useQuery('profiles', userService.fetchProfiles, {
         onError: (error: any) => {
            logger.error("Error fetching profiles:", error)
        }
     });


    return {
        fetchUsers: fetch,
        createUser: create,
        updateUser: update,
        getUser: get,
        deleteUser: remove,
        profiles,
    };
};

export default useUserApi;