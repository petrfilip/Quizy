import Card from "@material-ui/core/Card";
import { Badge, CardMedia, makeStyles } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";

// const useStyles = makeStyles({
//   root: {
//     maxWidth: 345,
//   },
//   media: {
//     height: 140,
//   },
// });

export default function LessonCard(lessonItem, onDelete) {
  // const classes = useStyles();

  return (
    <Card variant="outlined">
      {lessonItem.heroImage && <CardMedia
        loading="lazy"
        component="img"
        // className={classes.media}
        image={`${process.env.REACT_APP_BASE_URI}${lessonItem?.heroImage?.path}`}
      />}
      <CardContent>
        <Typography>
          {lessonItem.title}
        </Typography>


      </CardContent>
      <CardActions>
        <Badge badgeContent={lessonItem && lessonItem.flashcards && lessonItem.flashcards.length || "0"} color="primary">
          <MenuBookIcon/>
        </Badge>
        <Badge badgeContent={lessonItem.questions && lessonItem.questions.length || "0"} color="primary">
          <QuestionAnswerIcon/>
        </Badge>

        <Button color={"primary"} startIcon={<EditIcon/>} component={RouterLink} to={`/lessons/${lessonItem.slug}`}>Edit</Button>
        <Button color={"secondary"} startIcon={<DeleteIcon/>} onClick={() => onDelete(lessonItem)}>Delete</Button>
      </CardActions>
    </Card>
  );
}
