import React, { useState, useEffect, useLayoutEffect } from "react";
import FlashCardItemEditor from "./FlashCardItemEditor";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";

export default function QuizItemMain({ data }) {

  const [componentData, setComponentData] = useState(data)

  useLayoutEffect(()=> {
    setComponentData(data)
  },[])

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    data[name] = value

    const newData = { ...data };
    setComponentData(newData)
  }

  const addNewFlashcard = () => {

    if (!data.flashcards) {
      data.flashcards = [];
    }

    data.flashcards.push({
      title: "",
      description: ""
    })

    const newData = { ...data };
    setComponentData(newData)
  }

  return <div>
    <input type={"text"} name={"title"} value={componentData.title} onChange={handleInputChange}/>
    <input type={"text"} name={"slug"} value={urlSlug(componentData.title)} onChange={handleInputChange}/>
    <MDEditor
      value={componentData.description || ""}
      onChange={(src) => {
        handleInputChange({
            target: {
              value: src,
              name: "description"
            }
          }
        )
      }
      }
    />


    <input type={"text"} name={"heroImage"} value={componentData.heroImage} onChange={handleInputChange}/>

    <hr/>

    {componentData?.flashcards?.map((item, index) =>

      <>
        <FlashCardItemEditor key={`fc-${index}`} flashcard={item}/>
        <hr/>
      </>
    )}
    <button onClick={addNewFlashcard}>Add flashcard</button>

  </div>
}