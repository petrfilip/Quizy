import { useLayoutEffect, useState } from "react";
import PickOne from "./quizItem/PickOne";
import SimpleSequence from "./quizItem/SimpleSequence";
import PickMultiple from "./quizItem/PickMultiple";
import MarkdownPreview from "@uiw/react-markdown-preview";
import FillTextExactly from "./quizItem/FillTextExactly";
import { Badge, Container, makeStyles } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  info: { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, textAlign: "center", padding: "15px" },
}));

export default function QuizItem({ question, answer, onAnswerSubmit }) {
  const classes = useStyles();

  const [selected, setSelected] = useState(answer)
  const [customView, setCustomView] = useState()
  const [showCustomView, setShowCustomView] = useState(true)
  const { t } = useTranslation();


  useLayoutEffect(() => {
    setSelected(answer);
  }, [question.id])

  const onSubmitHandler = (inputQuestion, inputAnswer, isCorrect) => {
    setSelected(answer);
    onAnswerSubmit(inputQuestion, inputAnswer, isCorrect)
  }

  return (
    <>
      <div className={classes.info}>
        {question.questionType === 'pickOne' && t('title_selectOneOption')}
        {question.questionType === 'pickMultiple' && t('title_selectMultipleOptions')}
        {question.questionType === 'fillTextExactly' && t('title_fillFieldsExactly')}
      </div>

      <Container maxWidth="md" style={{ minHeight: '580px' }}>
        {selected && question.comment}

        <Container style={{
          paddingTop: '30px',
          paddingBottom: '30px', borderBottom: '1px solid gray',
          marginBottom: '30px'
        }}>
          <Badge
            style={{ display: "block" }}
            badgeContent={customView && showCustomView && <VisibilityOffIcon/> || customView && !showCustomView && <VisibilityIcon/>} color="secondary"
            onClick={() => customView && setShowCustomView(!showCustomView)}>
            <MarkdownPreview style={{ width: "100%" }} source={showCustomView && customView || question.question}/>
          </Badge>
        </Container>
        {question.questionType === "pickOne" && <PickOne
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.questionType === "sequence" && <SimpleSequence
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.questionType === "pickMultiple" && <PickMultiple
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}

        {question.questionType === "fillTextExactly" && <FillTextExactly
          setCustomView={setCustomView}
          questionItem={question}
          selectedItem={answer}
          onSubmit={onSubmitHandler}/>}



      </Container>
    </>)
}