import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CourseItemCard({ lessonItem, onDelete }) {
  const { t } = useTranslation();

  return (
    <Card variant="outlined">
      {/*<CardMedia*/}
      {/*  style={{*/}
      {/*    width: "auto",*/}
      {/*    maxHeight: "200px",*/}
      {/*  }}*/}
      {/*  component="img"*/}
      {/*  alt="Contemplative Reptile"*/}
      {/*  image="https://via.placeholder.com/500"*/}
      {/*  title="Contemplative Reptile"*/}
      {/*/>*/}
      <CardContent>
        <Typography>
          {lessonItem.title}
        </Typography>


      </CardContent>
      <CardActions>
        {/*<Badge badgeContent={lessonItem && lessonItem.flashcards && lessonItem.flashcards.length || "0"} color="primary">*/}
        {/*  <MenuBookIcon/>*/}
        {/*</Badge>*/}
        {/*<Badge badgeContent={lessonItem.questions && lessonItem.questions.length || "0"} color="primary">*/}
        {/*  <QuestionAnswerIcon/>*/}
        {/*</Badge>*/}

        <Button color={"primary"} startIcon={<EditIcon/>} component={RouterLink} to={`/courses/${lessonItem.slug}`}>{t('edit')}</Button>
        <Button color={"secondary"} startIcon={<DeleteIcon/>} onClick={() => onDelete(lessonItem)}>{t('delete')}</Button>
      </CardActions>
    </Card>
  );
}