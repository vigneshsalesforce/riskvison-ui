// src/components/generic/GenericList.tsx
import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { logger } from '../../utils/logger';


interface GenericListProps<T> {
    title: string;
  objectName: string;
  columns: {
    label: string;
    key: keyof T;
    isClickable?: boolean;
  }[];
   fetchData: (params: {page: number, limit:number, search?:string, sortBy?:string, sortOrder?:'asc'|'desc'}) => any;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  deleteLoading?:string | null;
  onCreate?: () => void;
  onNameClick?: (itemId: string) => void;
}


const GenericList = <T,>({
    title,
  objectName,
  columns,
    fetchData,
  onEdit,
  onDelete,
  deleteLoading,
    onCreate,
    onNameClick,
}: GenericListProps<T>) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState(1);
     const [sortBy, setSortBy] = useState<string|null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  const debouncedSearch = useDebounce(searchTerm, 500);
    const { data, isLoading, error } = fetchData({page: page, limit: 10, search: debouncedSearch, sortBy: sortBy || "createdAt", sortOrder});
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSort = (key:string) => {
      if(sortBy === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortBy(key);
        setSortOrder('asc');
      }
    }

    const renderHeader = useMemo(() => {
      return (
        <TableRow>
          {columns.map((column) => (
            <TableCell key={String(column.key)} style={{ cursor: 'pointer' }} onClick={() => handleSort(String(column.key))}>
             <strong>{column.label} {sortBy === String(column.key) ? (sortOrder === 'asc' ? '↑' : '↓') : null}</strong>
            </TableCell>
          ))}
           {onEdit || onDelete ? <TableCell align="right"><strong>Actions</strong></TableCell> : null}
        </TableRow>
      );
    }, [columns, handleSort, sortBy, sortOrder]);


  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
            {title}
        </Typography>
            {onCreate && (
          <Button variant="contained" onClick={onCreate}>
            + Create
          </Button>
            )}
      </Box>

      <Box mb={4}>
        <TextField
          label={`Search ${objectName}`}
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>          
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) :  !data?.data || data?.data?.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No records found.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                {renderHeader}
              </TableHead>
              <TableBody>
              {data?.data?.map((item: T) => (
                  <TableRow key={(item as any)._id}>
                        {columns.map((column) => (
                            <TableCell
                              key={String(column.key)}
                                style={{
                                 width: `${100 / columns.length}%`,
                                   overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  cursor: column.isClickable ? 'pointer' : 'default',
                                   color: column.isClickable ? 'blue' : 'initial'
                                }}
                                onClick={() => column.isClickable ? onNameClick((item as any)._id) : null }
                            >
                                 {String((item)[column.key as keyof T]?? "") || ""}
                            </TableCell>
                        ))}
                    {onEdit || onDelete ? (
                         <TableCell align="right" style={{ width: '10%', display: 'table-cell' }}>
                        <Box display="flex" justifyContent="flex-end">
                         {onEdit &&
                             <IconButton onClick={() => onEdit(item)}>
                                 <Edit style={{ color: 'black' }}/>
                             </IconButton>}
                         {onDelete &&
                           <IconButton onClick={() => onDelete((item as any)._id)} disabled={deleteLoading === (item as any)._id}>
                            {deleteLoading === (item as any)._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Delete style={{ color: 'black' }}/>
                            )}
                          </IconButton>}
                          </Box>
                        </TableCell>
                     ) : null}
                  </TableRow>
              ))}

              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
                count={data?.pagination?.totalPages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default GenericList;