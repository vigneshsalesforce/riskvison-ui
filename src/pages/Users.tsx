// src/pages/Users.tsx
import { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import useUserApi from '../features/users/hooks/useUserApi';
import {  CircularProgress,  } from '@mui/material';

interface User {
    _id?: string;
    name: string;
    email: string;
    profile: string;
}
interface Profile {
    _id: string,
    name: string
}

export default function Users() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState('');
    const { fetchUsers, createUser, updateUser, deleteUser, profiles, isLoading } = useUserApi();
    const [users, setUsers] = useState<User[]>([]);
      const [userProfiles, setUserProfiles] = useState<Profile[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
      const [sortBy, setSortBy] = useState('createdAt');
      const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('desc');


    const { data, refetch, isFetching } = fetchUsers({page, limit, search, sortBy, sortOrder});
    const { data: profilesData, isFetching : isFetchingProfiles } = profiles();


    useEffect(() => {
        if (data?.data) {
             setUsers(data.data);
            setTotalRecords(data.pagination.totalRecords);
            setTotalPages(data.pagination.totalPages);
        }
         if (profilesData) {
            setUserProfiles(profilesData);
         }
    }, [data, profilesData]);

      useEffect(() => {
          refetch();
      }, [page, limit, search, sortBy, sortOrder, refetch])
    const handleEdit = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setEmail(user.email);
        setProfile(user.profile);
        setIsModalOpen(true);
    };
      const handleProfileChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setProfile(event.target.value);
    }

    const handleCreateUser = async (e:any) => {
        e.preventDefault();
         if(editingUser?._id) {
                await updateUser.mutateAsync({id: editingUser._id, data: {name, email, profile}});
            }
            else{
              await createUser.mutateAsync({name, email, profile});
            }

        setIsModalOpen(false);
        setEditingUser(null);
        setName("");
        setEmail("");
        setProfile("");
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setName("");
        setEmail("");
        setProfile("");
    };
    const handleDelete = async (id:string) => {
     await deleteUser.mutateAsync(id);
    }
      const handlePageChange = (newPage:number) => {
          setPage(newPage);
      }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    }
      const handleSort = (field:string) => {
        setSortBy(field);
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                >
                    Create User
                </button>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                   <div className="flex justify-between items-center p-4">
                    <div className="relative rounded-md shadow-sm flex items-center">
                        <input
                            type="text"
                            className="block w-full pr-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md py-2 px-4"
                            placeholder="Search by name"
                             value={search}
                             onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSort('name')}
                            >Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSort('email')}
                             >Email{sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                              onClick={() => handleSort('profile')}
                             >Profile{sortBy === 'profile' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            isFetching ? (
                                   <tr>
                                    <td colSpan={4} className="text-center py-4"> <CircularProgress size={30} /></td>
                                   </tr>
                             ) : users?.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.profile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900 mr-3">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(user._id as string)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                         {users?.length === 0 && !isFetching && <tr>
                                <td colSpan={4} className="text-center py-4">No records found</td>
                         </tr>}
                    </tbody>
                </table>

                      {users?.length > 0 && <div className="flex justify-center mt-4">
                        <button
                           disabled={page <= 1}
                           onClick={() => handlePageChange(page - 1)}
                           className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md disabled:opacity-50"
                        >
                             Previous
                        </button>
                       <span className="px-4 py-2 text-sm font-medium text-gray-700">
                         Page {page} of {totalPages}
                       </span>
                       <button
                           disabled={page >= totalPages}
                           onClick={() => handlePageChange(page + 1)}
                           className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md disabled:opacity-50"
                        >
                             Next
                        </button>

                      </div> }
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-medium mb-4">
                            {editingUser ? 'Edit User' : 'Create User'}
                        </h2>
                        {isFetchingProfiles ? (
                                <div className="text-center"> <CircularProgress size={20} /> </div>
                            ) :  (

                            <form className="space-y-4" onSubmit={handleCreateUser}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={editingUser?.name}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={editingUser?.email}
                                        value={email}
                                         onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={editingUser?.profile}
                                         onChange={handleProfileChange}
                                          value={profile}
                                         required
                                    >
                                      <option value="">Select Profile</option>
                                       {userProfiles.map((profile) =>
                                           <option value={profile._id} key={profile._id}>{profile.name}</option>
                                       )}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                           )}
                    </div>
                </div>
            )}
        </div>
    );
}