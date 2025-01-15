// src/components/Header.tsx
import React from "react";
import { Box, Typography, Button, TextField, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";

interface HeaderProps {
  title: string;
  onSearchChange?: (value: string) => void;
  onCreate?: () => void;
  searchPlaceholder?: string;
  createButtonText?:string;
}

const Header: React.FC<HeaderProps> = ({ title, onSearchChange, onCreate, searchPlaceholder = "Search...", createButtonText = "+ Create" }) => {
  return (
    <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" fontWeight="bold">
                  {title}
              </Typography>
          {onCreate && <Button variant="contained" onClick={onCreate} color="primary">{createButtonText}</Button>}

          </Box>
        {onSearchChange && (
              <Box mb={2} display="flex" alignItems="center">
                  <TextField
                      label={searchPlaceholder}
                      variant="outlined"
                      onChange={(e) => onSearchChange(e.target.value)}
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
          )}
    </Box>
  );
};

export default Header;