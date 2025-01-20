// src/services/userService.ts
import api from './api'; // Assuming you have an api setup already

interface User {
  _id?: string;
  name: string;
  email: string;
  profile: string;
}

interface UserPaginatedResponse {
  data: User[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}
const fetchUsers = async (params: { page: number; limit: number; search?: string; sortBy?: string, sortOrder?: 'asc' | 'desc' })
: Promise<UserPaginatedResponse> => {
    const response = await api.get('/user/list', { params });
      return response.data.data;
};

const createUser = async (data: User): Promise<User> => {
  const response = await api.post('/user/create', data);
  return response.data.data;
};

const updateUser = async (id: string, data: User): Promise<User> => {
  const response = await api.put(`/user/${id}/update`, data);
  return response.data.data;
};

const deleteUser = async (id: string): Promise<string> => {
  await api.delete(`/user/${id}/delete`);
  return id;
};

const fetchUser = async (id: string): Promise<User> => {
  const response = await api.get(`/user/${id}/view`);
  return response.data.data;
};
const fetchProfiles = async () => {
  const response = await api.get(`/user/profiles`);
  return response.data.data;
};
const userService = {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchUser,
  fetchProfiles
};

export default userService;