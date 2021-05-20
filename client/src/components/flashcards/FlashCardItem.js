import { useLayoutEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Avatar, Container, makeStyles, Paper, Typography } from "@material-ui/core";
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import ReactCardFlip from 'react-card-flip';

const useStyles = makeStyles((theme) => ({
  info: { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, textAlign: "center", padding: "15px" },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function FlashCardItem({ flashcard, index }) {
  const classes = useStyles();

  const [isTurned, setIsTurned] = useState(false)

  useLayoutEffect(() => {
    setIsTurned(false)
  }, [flashcard])

  const frontSide = (<Paper>

    <Container className={classes.info}>
      <Typography>Do you know... </Typography>
    </Container>
    <Container maxWidth="md" style={{
      alignItems: 'center', minHeight: '580px', textAlign: "center", paddingTop: "25%", display: 'flex',
      flexDirection: 'column',
    }}>
      <Avatar className={classes.avatar}>
        <SwapHorizIcon/>
      </Avatar>
      <Typography variant="h4">{flashcard.title}</Typography>

      {/*{index === 0 && <div className={"card-flip-area"}>Flip the card</div>}*/}
    </Container>
  </Paper>)

  const backSide = (<Paper>
    <Container className={classes.info}>
      <Typography>{flashcard.title}</Typography>
    </Container>

    <Container maxWidth="md" style={{ minHeight: '580px' }}>
      <MarkdownPreview source={flashcard.description}/>
    </Container>

  </Paper>)

  return <div onClick={() => setIsTurned(!isTurned)}>
    <ReactCardFlip isFlipped={isTurned} flipDirection="horizontal">
      {frontSide}
      {backSide}
    </ReactCardFlip>
  </div>

}