import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { useArrayInput, useTranslate } from "react-admin";
import { Menu, IconButton, ListItemIcon, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export const CustomAddButton = () => {
  const context = useArrayInput();
  const translate = useTranslate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = (event: ReactMouseEvent<HTMLElement>) => {
    const value = (event.target as HTMLElement).getAttribute("value");

    context.append({
      action: "odrl:use",
      constraints: [
        {
          leftOperand: `edc:${value}`,
          operator: "",
          rightOperand: "",
        },
      ],
    });
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleClick}>
        <AddCircleOutlineIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem value="time" onClick={handleAdd} disableRipple>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          {translate("resources.policies.create.permissions.timeBased")}
        </MenuItem>
        <MenuItem value="participantId" onClick={handleAdd} disableRipple>
          <ListItemIcon>
            <PermIdentityIcon />
          </ListItemIcon>
          {translate("resources.policies.create.permissions.identityBased")}
        </MenuItem>
        <MenuItem value="location" onClick={handleAdd} disableRipple>
          <ListItemIcon>
            <LocationOnIcon />
          </ListItemIcon>
          {translate("resources.policies.create.permissions.locationBased")}
        </MenuItem>
      </Menu>
    </>
  );
};
