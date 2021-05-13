import React, { useLayoutEffect, useState } from 'react';

import { Card, CardHeader, CardMedia, makeStyles, Menu, MenuItem } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import DescriptionIcon from '@material-ui/icons/Description';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function FileCard({ file }) {

  const [isOpen, setIsOpen] = React.useState(null);
  const classes = useStyles();

  const handleClick = (event) => {
    setIsOpen(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpen(null);
  };

  return (
    <Card variant="outlined" className={classes.root}>
      <CardMedia
        loading="lazy"
        component="img"
        className={classes.media}
        image={`${process.env.REACT_APP_BASE_URI}${file.publicPath}`}
        title={file.originName}
      />
      <CardHeader

        avatar={<DescriptionIcon/>}
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
        title={file.originName}
        subheader={formatBytes(file.attributes.size, 2)}
      />
    </Card>
  );
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes'
  }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}