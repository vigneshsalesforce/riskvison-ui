// components/EntityList.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper,
    IconButton,
    CircularProgress,
    TextField,
    InputAdornment,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Pagination,
    useTheme,
    Typography,
    Button,
    Link
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import ErrorHandler from "./ErrorHandler";
import { debounce } from "lodash";
import {  styled } from '@mui/material/styles';
import logger from "../utils/logger";
import { useToast } from "./Toast";

interface Column {
    label: string;
    key: string;
    render?: (item: any, handleNameClick:(id:string) => void ) => React.ReactNode;
}


interface EntityListProps<T> {
    title: string;
    fetchData: (page: number, search:string) => Promise<any>; // Function to fetch data
    onDelete: (id: string) => Promise<void>; // Function to delete an entity
     onEdit?: (item: T) => void; //Function to edit an entity
    onCreate?: () => void; //Function to create an entity
    columns: Column[];
    entityName: string;
    createButtonText?: string,
    searchPlaceholder?: string;
      onNameClick?: (id:string) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.MuiTableCell-head`]:{
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.grey[900],
        fontWeight: 'bold'
    },
    [`&.MuiTableCell-body`]:{
        fontSize: '1rem',
    }
}));


const EntityList = <T extends Record<string, any>>({
    title,
    fetchData,
     onDelete,
    onEdit,
    onCreate,
    columns,
    entityName,
     createButtonText = "+ Create",
    searchPlaceholder = "Search...",
    onNameClick,
}: EntityListProps<T>) => {
    const theme = useTheme();
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
      const { showToast } = useToast();
    const debouncedSearch = useCallback(
        debounce((value) => {
            fetchEntities(1, value);
        }, 500),
        []
    );



    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
       debouncedSearch(event.target.value)
    };

    const fetchEntities = useCallback(async (page: number, search: string) => {
         setLoading(true);
        try {
             const response = await fetchData(page, search);
            setItems(response?.data || []);
            setTotalPages(response?.pagination?.totalPages || 1);
             setError(null);
        } catch(e:any) {
              logger.error(`Error fetching ${entityName} data`, e);
              showToast('error', e.message || `Error fetching ${entityName} data` , 'Error')
            setError(e.message || `Error fetching ${entityName} data`);
          setItems([]);
        } finally {
            setLoading(false);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityName, fetchData, showToast]);


    useEffect(() => {
        fetchEntities(currentPage, searchTerm);
    }, [fetchEntities, currentPage, searchTerm]);


    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

   const handleItemDelete = async (id: string) => {
          setDeleteLoading((prev) => ({ ...prev, [id]: true }));
        try{
             await onDelete(id);
           showToast('success', `${entityName} deleted successfully`, 'Success')
        } catch(e:any) {
           logger.error(`Error deleting ${entityName}`, e);
          showToast('error', e.message || `Error deleting ${entityName}`, 'Error');
        }
        finally {
          setDeleteLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Box p={4} >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    {title}
                </Typography>
               {onCreate && <Button variant="contained" onClick={onCreate} color="primary">
                    {createButtonText}
                </Button>}
            </Box>
              <Box mb={2} display="flex" alignItems="center">
                <TextField
                    label={searchPlaceholder}
                    variant="outlined"
                   value={searchTerm}
                   onChange={handleSearchChange}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
               <ErrorHandler message={error || ""} open={!!error} onClose={handleCloseError} />
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 1, overflow: 'hidden' }}>
                   {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                            <CircularProgress />
                        </Box>
                    ) : items.length === 0 ? (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="textSecondary">
                                No records found. Try creating one!
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ overflow: 'auto', maxHeight:'calc(100vh - 300px)'}}>
                        <Table sx={{ minWidth: 650 }} aria-label="accounts table" stickyHeader>
                            <TableHead >
                                <TableRow>
                                    {columns.map(column => (
                                         <StyledTableCell key={column.key}>{column.label}</StyledTableCell>
                                    ))}
                                    <StyledTableCell align="right">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {items.map((item) => (
                                    <TableRow
                                        key={item._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } ,
                                          '&:hover': {
                                                backgroundColor: theme.palette.action.hover,
                                                cursor: 'pointer'
                                            }
                                        }}
                                    >
                                         {columns.map((column) => (
                                             <StyledTableCell key={column.key}>
                                                {column.render
                                                    ? column.render(item, onNameClick)
                                                    : String(item[column.key])}
                                             </StyledTableCell>
                                          ))}
                                          <StyledTableCell align="right">
                                              { onEdit && (
                                                  <IconButton
                                                      onClick={() => onEdit(item)}
                                                      aria-label="edit"
                                                      color="primary"
                                                      size="large"
                                                  >
                                                      <Edit />
                                                  </IconButton>
                                              )}
                                              <IconButton
                                                  onClick={() => handleItemDelete(item._id)}
                                                  aria-label="delete"
                                                  color="error"
                                                  size="large"
                                                  disabled={!!deleteLoading[item._id]}
                                              >
                                                  {deleteLoading[item._id] ? (
                                                      <CircularProgress size={24} />
                                                  ) : (
                                                      <Delete />
                                                  )}
                                              </IconButton>
                                          </StyledTableCell>
                                      </TableRow>
                                  ))}
                            </TableBody>
                        </Table>
                    </Box>
                    )}
                 </TableContainer>
                   <Box mt={3} display="flex" justifyContent="center">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                             color="primary"
                        />
                    </Box>
            </Box>

    );
};

export default EntityList;