import React, { useContext } from "react";
import {
  ArrayField,
  ArrayFieldProps,
  ResourceContext,
  ResourceContextProvider,
  useRecordContext,
} from "react-admin";
import { get, set, cloneDeep } from "lodash";

interface EnsureArrayFieldProps extends Omit<ArrayFieldProps, "source"> {
  source: string;
  resource?: string;
}

export const EnsureArrayField: React.FC<EnsureArrayFieldProps> = ({
  source,
  children,
  resource,
  ...props
}) => {
  const record = useRecordContext();
  const contextResource = useContext(ResourceContext);
  if (!record) {
    return null;
  }

  const value = get(record, source);
  const ensuredArrayValue = Array.isArray(value) ? value : value ? [value] : [];

  // todo: check later if this is needed
  const transformedRecord = cloneDeep(record);
  set(transformedRecord, source, ensuredArrayValue);

  const resolvedResource = resource ?? contextResource ?? "embedded";

  const arrayField = (
    <ArrayField
      source={source}
      record={transformedRecord}
      resource={resolvedResource}
      {...props}
    >
      {children}
    </ArrayField>
  );

  if (contextResource || resource) {
    return arrayField;
  }

  return (
    <ResourceContextProvider value={resolvedResource}>
      {arrayField}
    </ResourceContextProvider>
  );
};
