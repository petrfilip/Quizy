import { Typography } from "@material-ui/core";

export default function QuizProgress({ current, total }) {
  return <Typography>Progress: {current} / {total}</Typography>
}