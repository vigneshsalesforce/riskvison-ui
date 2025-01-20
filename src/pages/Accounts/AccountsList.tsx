//pages/Accounts/AccountsList.tsx
import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import AccountFormModal from "../../components/AccountFormModal";
import { useNavigate } from "react-router-dom";
import ErrorHandler from "../../components/ErrorHandler";
import { debounce } from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccounts, deleteAccount, setSearchTerm, setCurrentPage } from "../../slices/accountListSlice";
import { RootState } from "../../store";

interface Account {
    _id: string;
    Name: string;
    address: string;
    contact: string;
}

const AccountsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const { accounts, loading, searchTerm, currentPage, totalPages, error, deleteLoading } = useSelector((state: RootState) => state.accountList);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const debouncedSearch = useCallback(
        debounce((value) => {
            dispatch(fetchAccounts({ page: 1, search: value }));
        }, 500),
        [dispatch]
    );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setSearchTerm(event.target.value));
    debouncedSearch(event.target.value)
  };

  useEffect(() => {
        dispatch(fetchAccounts({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);


    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
      dispatch(setCurrentPage(value));
    };

    const handleCreate = () => {
        setSelectedAccount(null);
        setIsModalOpen(true);
    };

    const handleEdit = (account: Account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

  const handleDelete = async (id: string) => {
      dispatch(deleteAccount(id))
  };


  const handleNameClick = (accountId:string) => {
      navigate(`/accounts/${accountId}/view`);
  };


    const handleSave = () => {
        setIsModalOpen(false);
    };

    const handleCloseError = () => {
        // set the error to null in the state or local state
    };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Accounts
        </Typography>
        <Button variant="contained" onClick={handleCreate}>
          + Create Account
        </Button>
      </Box>

      <Box mb={4}>
        <TextField
          label="Search Accounts"
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
        <ErrorHandler message={error || ""} open={!!error} onClose={handleCloseError}/>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : accounts.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            No accounts found. Try creating one!
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Contact</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell onClick={() => handleNameClick(account._id)}
                               style={{ cursor: 'pointer', color: 'blue' }}>
                      {account.Name}</TableCell>
                    <TableCell>{account.address}</TableCell>
                    <TableCell>{account.contact}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEdit(account)}>
                        <Edit />
                      </IconButton>
                        <IconButton onClick={() => handleDelete(account._id)}
                                    disabled={deleteLoading === account._id}>
                            {deleteLoading === account._id ? (
                                <CircularProgress size={20} />
                            ) : (
                                <Delete />
                            )}
                        </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

        {isModalOpen && (
            <AccountFormModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                account={selectedAccount}
                onSaved={handleSave}
            />
        )}
    </Box>
  );
};

export default AccountsList;