import AnswerFields from "./AnswerFields";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function FillTextExactly({ question, answers, onAnswerChange, correctAnswer, onCorrectAnswerChange, parameters, onUpdateParameters, answerType }) {

  const [showPreview, setShowPreview] = useState(false)

  useLayoutEffect(() => {
    const matches = question.match(/\${([^}]+)}/g)
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

  const updateParameters = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    parameters = parameters || {}
    parameters[name] = value
    onUpdateParameters({ ...parameters })
  }

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
      {!question.match(/\${([^}]+)}/g) && "This `${1}` is placeholder. Put `${1}` into the question. "
      + "Which cause new field. For each placeholder use unique inner text such as `${1}`, `${2}`, or `${WhateverYouWant}`.  "}
      {showPreview ?
        <div onClick={() => setShowPreview(false)}><MarkdownPreview source={text}/></div> :
        <button onClick={() => setShowPreview(true)}>Show result preview</button>}
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

    <div>
      <div>
        <label>Ignore cases:</label>
        <input type="checkbox" name={"ignoreCases"} checked={parameters?.ignoreCases} onChange={updateParameters}/>
      </div>
      <div>
        <label>Strip empty characters:</label>
        <input type="checkbox" name={"stripEmptyCharacters"} checked={parameters?.stripEmptyCharacters} onChange={updateParameters}/>
      </div>
    </div>

  </>
}