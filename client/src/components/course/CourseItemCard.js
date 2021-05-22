import { Card, CardActions, CardMedia } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { useTranslation } from "react-i18next";

export default function CourseItemCard({ lessonItem, onClick }) {
  const { t } = useTranslation();


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
        <Button color={"secondary"} component={RouterLink} startIcon={<DoubleArrowIcon/>} to={`/courses/${lessonItem.slug}`} >{t('button_learn')}</Button>
      </CardActions>
    </Card>
  );
}