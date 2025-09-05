import { useState } from "react";
import { Show, useStore } from "react-admin";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { CatalogConnect } from "./CatalogConnect";
import { CatalogShow } from "./CatalogShow";

export const Catalog = () => {
  const [counterPartyAddress] = useStore("counterPartyAddress");
  const [error, setError] = useState<string | null>(null);

  const onError = (e: any) => {
    setError(e);
  };

  const onSuccess = () => {
    setError(null);
  };

  return (
    <>
      <CatalogConnect />
      {error && (
        <Alert severity="error">
          Unable to fetch catalog {counterPartyAddress}
        </Alert>
      )}
      {counterPartyAddress && (
        <Show
          resource="catalog"
          id={counterPartyAddress}
          queryOptions={{
            onError,
            onSuccess,
          }}
          component={(props) => <Box {...props} sx={{ maxWidth: "100%" }} />}
        >
          <CatalogShow />
        </Show>
      )}
    </>
  );
};
