import React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Chip } from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { useTranslation } from "react-i18next";

const UserCard = ({ userItem, onDelete, onClick, onTagClick }) => {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>
          {userItem.mail}
        </Typography>
        {userItem.labels?.map(label => <Chip
          onClick={() => onTagClick && onTagClick(label, userItem)}
          label={label}/>)}
      </CardContent>
      <CardActions>
        {onDelete && <Button title={t('delete')} color={"secondary"} startIcon={<DeleteIcon/>} onClick={() => onDelete(userItem)}/>}
        {onClick && <Button title={t('detail')} color={"primary"} startIcon={<OpenInNewIcon/>} onClick={() => onClick(userItem)}/>}
      </CardActions>
    </Card>
  );
};

export default UserCard;