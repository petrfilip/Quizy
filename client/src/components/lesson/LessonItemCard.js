import { Card, CardActions, CardMedia } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";

export default function LessonItemCard(lessonItem, onClick) {

  return (
    <Card variant="outlined">
      {lessonItem.heroImage && <CardMedia
        style={{
          width: "auto",
          maxHeight: "200px",
        }}
        loading="lazy"
        component="img"
        image={`${process.env.REACT_APP_BASE_URI}${lessonItem?.heroImage?.path}`}
        alt={lessonItem.title}
      />}
      <CardContent>
        <Typography>
          {lessonItem.title}
        </Typography>


      </CardContent>
      <CardActions>
        <Button color={"secondary"} component={RouterLink} startIcon={<DoubleArrowIcon/>} to={`/lessons/${lessonItem.slug}`} >Learn</Button>
      </CardActions>
    </Card>
  );
}