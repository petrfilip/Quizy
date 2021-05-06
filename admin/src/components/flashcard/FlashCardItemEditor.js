import React, { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { TextField } from "@material-ui/core";

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


  return <div>
    <TextField
      fullWidth
      placeholder={"Flash cart title"}
      type={"text"}
      name={"title"}
      value={componentData.title}
      onChange={handleInputChange}
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