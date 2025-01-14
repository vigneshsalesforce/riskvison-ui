import React, { useState, useEffect } from "react";
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
import api from "../../services/api";
import { useNavigate } from 'react-router-dom';

interface Account {
  _id: string;
  Name: string;
  address: string;
  contact: string;
}

const AccountsList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAccounts = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await api.get("/account/list", {
        params: { page, limit: 10, search },
      });

      const { data, pagination } = response.data.data;
      console.log(data);
      setAccounts(Array.isArray(data) ? data : []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleCreate = () => {
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    console.log(account);
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/account/${id}`);
      setAccounts((prev) => prev.filter((account) => account._id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const navigate = useNavigate();

  const handleNameClick = (accountId) => {
    navigate(`/accounts/${accountId}/view`);
  };


  const handleSave = () => {
    fetchAccounts(currentPage, searchTerm);
    setIsModalOpen(false);
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
                      <IconButton onClick={() => handleDelete(account._id)}>
                        <Delete />
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