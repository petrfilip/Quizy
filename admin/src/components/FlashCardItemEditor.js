import React, { useState } from "react";
import MDEditor from '@uiw/react-md-editor';

export default function FlashCardItemEditor({ flashcard }) {

  const [componentData, setComponentData] = useState(flashcard)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    flashcard[name] = value
    const newData = { ...flashcard };
    setComponentData(newData)
  }

  const style = {
    width:"100%",
    padding: "5px",
    borderRight: "0px",
    borderTop: "0px",
    borderBottom: "0px",
    borderLeft: "1px solid red",
    backgroundColor: "#f8f8f8",
    fontSize: "1.5em"
  }

  return <div>
    <input
      type={"text"}
      name={"title"}
      value={componentData.title}
      onChange={handleInputChange}
      style={style}
    />
    {/*<textarea name={"description"} value={componentData.description} onChange={handleInputChange}/>*/}

    <MDEditor
      height={400}
      value={componentData.description}
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
    {/*<MDEditor.Markdown source={componentData.description}/>*/}
  </div>
}