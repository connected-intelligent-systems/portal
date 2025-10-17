import { GenericPermissionShow } from "./GenericPermissionShow";
import { IdentityBasedPermissionShow } from "./IdentityBasedPermissionShow";
import { LocationBasedPermissionShow } from "./LocationBasedPermissionShow";
import { TimeBasedPermissionShow } from "./TimeBasedPermissionShow";

type PermissionProps = {
  permission: any;
};

export const PermissionRenderer = ({ permission }: PermissionProps) => {
  if (
    !permission ||
    !permission.constraints ||
    permission.constraints.length === 0
  ) {
    return <GenericPermissionShow permission={permission} />;
  }

  const firstConstraint = permission.constraints[0];

  switch (firstConstraint.leftOperand) {
    case "edc:time":
      return <TimeBasedPermissionShow permission={permission} />;
    case "edc:participantId":
      return <IdentityBasedPermissionShow permission={permission} />;
    case "edc:location":
      return <LocationBasedPermissionShow permission={permission} />;
    default:
      return <GenericPermissionShow permission={permission} />;
  }
};
