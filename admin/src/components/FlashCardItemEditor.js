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

  return <div>
    <input type={"text"} name={"title"} value={componentData.title} onChange={handleInputChange}/>
    {/*<textarea name={"description"} value={componentData.description} onChange={handleInputChange}/>*/}

    <MDEditor
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