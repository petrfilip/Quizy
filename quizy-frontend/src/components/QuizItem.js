import { useState, useLayoutEffect } from "react";
import Paging from "./Paging";
import PickOne from "./quitItem/PickOne";
import PickOneCode from "./quitItem/PickOneCode";

export default function QuizItem({ question, paging }) {
  console.log(question)
  const [selected, setSelected] = useState(null)

  useLayoutEffect(() => {
    setSelected(null);
  }, [question])

  const onSubmitHandler = (answer) => {
    setSelected(answer)
  }

  return (
    <>
      <div className={"question-frame"}>
        {selected && question.comment}
        {/*{selected && JSON.stringify(selected)}*/}

        {question.type === "pickOne" && <PickOne questionItem={question} onSubmit={onSubmitHandler}/>}
        {question.type === "pickOneCode" && <PickOneCode questionItem={question} onSubmit={onSubmitHandler}/>}
      </div>
      <Paging paging={paging}/>
    </>)
}