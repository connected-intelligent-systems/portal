import { useState } from "react";
import { useStore } from "react-admin";
import MuiTextField from "@mui/material/TextField";
import MuiButton from "@mui/material/Button";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";

const CatalogConnectButton = () => {
  const [counterPartyAddress, setCounterPartyAddress] = useStore(
    "counterPartyAddress",
    null
  );

  if (counterPartyAddress) {
    return (
      <MuiButton
        onClick={() => setCounterPartyAddress(null)}
        variant="text"
        startIcon={<LinkOffIcon />}
      >
        Disconnect
      </MuiButton>
    );
  } else {
    return null;
  }
};

export const CatalogConnect = () => {
  const [counterPartyAddress, setCounterPartyAddress] = useStore(
    "counterPartyAddress",
    null
  );
  const [inputValue, setInputValue] = useState("/api/dsp");

  const connect = () => {
    (setCounterPartyAddress as any)(inputValue);
  };

  return (
    <MuiTextField
      label="EDC Address"
      value={inputValue}
      disabled={counterPartyAddress !== null}
      onChange={(e) => setInputValue(e.target.value)}
      InputProps={{
        endAdornment: counterPartyAddress ? (
          <CatalogConnectButton />
        ) : (
          <MuiButton onClick={connect} variant="text" startIcon={<LinkIcon />}>
            Connect
          </MuiButton>
        ),
      }}
      fullWidth
    />
  );
};
