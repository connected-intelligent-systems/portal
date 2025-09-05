import React from "react";
import { ArrayField, ArrayFieldProps, useRecordContext } from "react-admin";
import { get, set, cloneDeep } from "lodash";

interface EnsureArrayFieldProps extends Omit<ArrayFieldProps, "source"> {
  source: string;
}

export const EnsureArrayField: React.FC<EnsureArrayFieldProps> = ({
  source,
  children,
  ...props
}) => {
  const record = useRecordContext();
  if (!record) {
    return null;
  }

  const value = get(record, source);
  const ensuredArrayValue = Array.isArray(value) ? value : value ? [value] : [];

  // todo: check later if this is needed
  const transformedRecord = cloneDeep(record);
  set(transformedRecord, source, ensuredArrayValue);

  return (
    <ArrayField source={source} record={transformedRecord} {...props}>
      {children}
    </ArrayField>
  );
};
