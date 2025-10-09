import { SimpleFormIterator, FormDataConsumer } from "react-admin";
import { CustomAddButton } from "./CustomAddButton";
import { TimeBasedPermission } from "./TimeBasedPermission";
import { IdentityBasedPermission } from "./IdentityBasedPermission";
import { LocationBasedPermission } from "./LocationBasedPermission";

export const PermissionCreate = () => {
  const renderPermission = (formData: any) => {
    if (formData && formData.constraints && formData.constraints.length > 0) {
      const firstConstraint = formData.constraints[0];

      if (firstConstraint.leftOperand === "edc:time") {
        return <TimeBasedPermission />;
      }
      if (firstConstraint.leftOperand === "edc:participantId") {
        return <IdentityBasedPermission />;
      }
      if (firstConstraint.leftOperand === "edc:location") {
        return <LocationBasedPermission />;
      }
    }

    return (
      <div>
        <p>Select a permission type from the + button above</p>
      </div>
    );
  };

  return (
    <SimpleFormIterator addButton={<CustomAddButton />}>
      <FormDataConsumer>
        {({ scopedFormData }) => {
          return renderPermission(scopedFormData);
        }}
      </FormDataConsumer>
    </SimpleFormIterator>
  );
};
