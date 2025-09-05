import React, { useState, useEffect } from "react";
import { useStore } from "react-admin";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import DeleteIcon from "@mui/icons-material/Delete";

// LocalStorage utilities
const STORAGE_KEY = "catalog_connection_history";

const getStoredUrls = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUrlToHistory = (url: string) => {
  const urls = getStoredUrls();
  if (!urls.includes(url)) {
    const updatedUrls = [url, ...urls].slice(0, 10); // Keep only last 10
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
  }
};

const removeUrlFromHistory = (url: string) => {
  const urls = getStoredUrls();
  const updatedUrls = urls.filter((u) => u !== url);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUrls));
};

const CatalogConnectButton = () => {
  const [counterPartyAddress, setCounterPartyAddress] = useStore(
    "counterPartyAddress",
    null
  );

  if (counterPartyAddress) {
    return (
      <Button
        onClick={() => setCounterPartyAddress(null)}
        variant="outlined"
        startIcon={<LinkOffIcon />}
      >
        Disconnect
      </Button>
    );
  } else {
    return null;
  }
};

export const CatalogConnect = ({ error }: { error?: string | null }) => {
  const [counterPartyAddress, setCounterPartyAddress] = useStore(
    "counterPartyAddress",
    null
  );
  const [inputValue, setInputValue] = useState("/api/dsp");
  const [urlHistory, setUrlHistory] = useState<string[]>([]);

  useEffect(() => {
    setUrlHistory(getStoredUrls());
  }, []);

  // Reset connection when error occurs
  useEffect(() => {
    if (error && counterPartyAddress) {
      (setCounterPartyAddress as any)(null);
    }
  }, [error, counterPartyAddress, setCounterPartyAddress]);

  const connect = () => {
    if (inputValue.trim()) {
      (setCounterPartyAddress as any)(inputValue.trim());
      saveUrlToHistory(inputValue.trim());
      setUrlHistory(getStoredUrls());
    }
  };

  const handleDeleteUrl = (urlToDelete: string) => {
    removeUrlFromHistory(urlToDelete);
    setUrlHistory(getStoredUrls());
    if (inputValue === urlToDelete) {
      setInputValue("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !counterPartyAddress) {
      connect();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Autocomplete
        freeSolo
        fullWidth
        disabled={counterPartyAddress !== null}
        options={urlHistory}
        value={inputValue}
        onInputChange={(_, newValue) => setInputValue(newValue || "")}
        renderInput={(params) => (
          <TextField
            {...params}
            label="EDC Address"
            placeholder="Enter EDC endpoint URL..."
            onKeyDown={handleKeyDown}
            helperText="Enter an EDC catalog endpoint URL or select from history"
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{option}</span>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUrl(option);
              }}
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      />
      <Box sx={{ mt: 1 }}>
        {counterPartyAddress ? (
          <CatalogConnectButton />
        ) : (
          <Button
            onClick={connect}
            variant="contained"
            startIcon={<LinkIcon />}
            disabled={!inputValue.trim()}
          >
            Connect
          </Button>
        )}
      </Box>
    </Box>
  );
};
