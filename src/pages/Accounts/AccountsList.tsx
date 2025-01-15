// pages/Accounts/AccountsList.tsx

import React, {  useState, useCallback } from "react";
import AccountFormModal from "../../components/AccountFormModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { fetchAccounts, deleteAccount } from "../../slices/accountListSlice";
import { useToast } from "../../components/Toast";
import EntityList from "../../components/EntityList";
import { Link } from "@mui/material";

const AccountsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { showToast } = useToast();
    const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleCreate = () => {
        setSelectedAccount(null);
        setIsModalOpen(true);
    };

    const handleEdit = (account: any) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsModalOpen(false);
    };

    const handleNameClick = (accountId: string) => {
        navigate(`/accounts/${accountId}/view`);
    };

    const handleFetchAccounts = useCallback(async (page: number, search: string) => {
           return  await dispatch(fetchAccounts({page, search})).unwrap();
       }, [dispatch]);



   const handleAccountDelete = useCallback(async (id:string) => {
        try{
          await dispatch(deleteAccount(id)).unwrap();
        }
        catch(e:any) {
            showToast('error', e.message || `Error deleting account`, 'Error');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ dispatch, showToast]);

    const columns = [
        {
            label: "Name",
            key: "Name",
          render:(item: any, handleNameClick:any) => {
              return (
                <Link
                  component="button"
                  onClick={() => handleNameClick(item._id)}
                   sx={{
                       textDecoration: "underline",
                         cursor: "pointer",
                       color: "primary.main",
                   }}
                >
                    {item.Name}
                  </Link>
              )
          }
        },
        {
            label: "Address",
            key: "address",
        },
        {
            label: "Contact",
            key: "contact",
        },
    ];

    return (
        <>
            <EntityList
                title="Accounts"
                fetchData={handleFetchAccounts}
                onDelete={handleAccountDelete}
                onEdit={handleEdit}
                onCreate={handleCreate}
                columns={columns}
                entityName="account"
                createButtonText="+ Create Account"
                searchPlaceholder="Search Accounts"
                onNameClick={handleNameClick}
            />
            {isModalOpen &&
                <AccountFormModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    account={selectedAccount}
                    onSaved={handleSave}
                />
            }
        </>
    );
};

export default AccountsList;