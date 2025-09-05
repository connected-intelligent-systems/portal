import React from "react";
import { TopToolbar, DeleteButton, EditButton } from "react-admin";

export const PolicyShowBar = () => {
  return (
    <TopToolbar>
      <EditButton />
      <DeleteButton mutationMode="pessimistic" />
    </TopToolbar>
  );
};
