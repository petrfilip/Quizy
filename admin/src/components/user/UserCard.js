import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const UserCard = ({userItem, onDelete, onClick}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>
          {userItem.mail}
        </Typography>
        {userItem.labels?.map(label => <Chip label={label} />)}
      </CardContent>
      <CardActions>
        {onDelete && <Button color={"secondary"} startIcon={<DeleteIcon/>} onClick={() => onDelete(userItem)}/>}
        {onClick && <Button color={"primary"} startIcon={<OpenInNewIcon/>} onClick={() => onClick(userItem)}/>}
      </CardActions>
    </Card>
  );
};

export default UserCard;