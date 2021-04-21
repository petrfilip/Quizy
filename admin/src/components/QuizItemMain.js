import React, { useState, useEffect, useLayoutEffect } from "react";
import FlashCardItemEditor from "./FlashCardItemEditor";
import urlSlug from 'url-slug'
import MDEditor from "@uiw/react-md-editor";

export default function QuizItemMain({ data}) {

  const [componentData, setComponentData] = useState(data)

  useLayoutEffect(()=> {
    setComponentData(data)
  },[])

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    data[name] = value
    setComponentData({ ...data })
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
    <h2>Quiz info</h2>
    <input type={"text"} name={"title"} value={componentData.title} onChange={handleInputChange}/>
    <input disabled={true} type={"text"} name={"slug"} value={urlSlug(componentData.title)} onChange={handleInputChange}/>

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


    <input type={"text"} placeholder={"heroImage"} name={"heroImage"} value={componentData.heroImage} onChange={handleInputChange}/>

    <hr/>
    <h2>Flash Cards</h2>

    {componentData?.flashcards?.map((item, index) =>

      <div key={`fc-${index}`}>
        <FlashCardItemEditor  flashcard={item}/>
        <hr/>
      </div>
    )}
    <button onClick={addNewFlashcard}>Add flashcard</button>

  </div>
}