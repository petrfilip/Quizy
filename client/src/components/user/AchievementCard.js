import { Card } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import GradeIcon from "@material-ui/icons/Grade";

export default function AchievementCard({ item }) {

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>
          {item.examTitle} ID:{item._id}
        </Typography>
        <Button startIcon={<EventAvailableIcon/>} color={"primary"}>{item.finishedAt}</Button>
        <Button startIcon={<GradeIcon />} color={"primary"}>{item.score}</Button>
      </CardContent>

    </Card>
  );
}