import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import AccountFormModal from "../../components/AccountFormModal";

interface Field {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: {
    static?: string[];
    dynamic?: {
      objectName: string;
      displayField: string;
      valueField: string;
    };
  };
}

interface ObjectDefinition {
  name: string;
  label: string;
  fields: Field[];
}

const AccountView: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<Record<string, any> | null>(null);
  const [objectDefinition, setObjectDefinition] = useState<ObjectDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [definitionRes, accountRes] = await Promise.all([
          api.get(`/object/account`),
          api.get(`/account/${accountId}/view`),
        ]);
        setObjectDefinition(definitionRes.data.data);
        setAccount(accountRes.data.data);
      } catch (error) {
        console.error("Error fetching account details:", error);
        navigate("/accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId, navigate]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditUpdate = () => {
    api.get(`/account/${accountId}/view`).then((response) => {
        setAccount(response.data.data);
    });
    setIsEditModalOpen(false);
  }

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) return " ";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!account || !objectDefinition) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="textSecondary">
          Account not found or object definition missing.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {account.Name || "Unnamed Account"}
          </Typography>
          {account.Type && (
            <Chip
              label={account.Type}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit}
          sx={{ textTransform: "none" }}
        >
          Edit Account
        </Button>
      </Box>

      {/* Account Details */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
            Account Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            {objectDefinition.fields?.length ? (
              objectDefinition.fields.map((field) => (
                <Grid item xs={12} sm={6} md={4} key={field.name}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        color: "text.secondary",
                        mb: 0.5,
                      }}
                    >
                      {field.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        wordBreak: "break-word",
                        color: account[field.name] ? "text.primary" : "text.secondary",
                      }}
                    >
                      {formatFieldValue(account[field.name])}
                    </Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary">
                  No fields available in the object definition.
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <AccountFormModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          account={account}
          onSaved={handleEditUpdate}
        />
      )}
    </Box>
  );
};

export default AccountView;