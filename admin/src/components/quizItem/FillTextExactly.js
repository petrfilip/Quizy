import AnswerFields from "./AnswerFields";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MarkdownPreview from '@uiw/react-markdown-preview';


export default function FillTextExactly({ question, answers, onAnswerChange, correctAnswer, onCorrectAnswerChange, answerType }) {

  const [showPreview, setShowPreview] = useState(false)


  useLayoutEffect(() => {
    const matches = question.match(/\${([^}]+)}/g)
    console.log(matches)
    for (const matchesKey in matches) {
      answers[matchesKey] = answers[matchesKey] || ""
    }

    if (answers && matches && answers.length > matches.length) {
      const remove = answers.length - matches.length
      for (let i = 0; i < remove; i++) {
        answers.pop()
      }
    }

    onAnswerChange([...answers])
    onCorrectAnswerChange([...answers])
  }, [question])

  const onInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    answers[target.id] = value
    onAnswerChange([...answers])
    onCorrectAnswerChange([...answers])
  }

  let text = question && question.match(/\${([^}]+)}/g) && answers.reduce((acc, item, i) => {
    return acc.replace(question.match(/\${([^}]+)}/g)[i], answers[i]);
  }, question);

  return <>
    <div>
      {showPreview ?
        <div onClick={()=>setShowPreview(false)}><MarkdownPreview source={text}  /></div> :
        <button onClick={()=>setShowPreview(true)}>Show result preview</button>}
    </div>
    {answers && answers.map((item, index) =>
      <div key={`pickOne-${index}`}>

        <label
          style={{
            fontSize: "1em",
            fontWeight: "bold"
          }}
          htmlFor={`field${index}`}>{index}: </label>

        <AnswerFields key={`answer-${index}`}
                      id={index}
                      answer={{ text: item }}
                      onInputChange={onInputChange}
                      answerType={answerType}
        />
      </div>
    )}



  </>
}