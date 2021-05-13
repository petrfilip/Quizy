import React, { useLayoutEffect, useState } from 'react';

import { Card, CardHeader, Menu, MenuItem } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderIcon from '@material-ui/icons/Folder';

export default function DirectoryCard({ directory }) {

  const [isOpen, setIsOpen] = React.useState(null);

  const handleClick = (event) => {
    setIsOpen(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpen(null);
  };

  return (
    <Card variant="outlined">

      {/*<CardActions>*/}
      {/*  <Button color={"secondary"} startIcon={<DeleteIcon/>} />*/}

      {/*</CardActions>*/}
      <CardHeader

        avatar={<FolderIcon/>}
        // disableTypography={true}
        action={
          <div>
            <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <MoreVertIcon/>
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={isOpen}
              keepMounted
              open={Boolean(isOpen)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Button startIcon={<DeleteIcon/>}>
                  Delete
                </Button>
              </MenuItem>
            </Menu>
          </div>

        }
        title={directory.originName || ` `}
        subheader={directory.sys.updated}
      />
    </Card>
  );
}
