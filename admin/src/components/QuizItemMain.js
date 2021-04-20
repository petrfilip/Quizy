import React, { useState } from "react";
import slugify from "react-slugify";

export default function QuizItemMain({ data }) {

  const [componentData, setComponentData] = useState(data)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    data[name] = value

    const newData = { ...data };
    setComponentData(newData)
  }

  return <div>
    <input type={"text"} name={"title"} value={componentData.title} onChange={handleInputChange}/>
    <input type={"text"} name={"slug"} value={slugify(componentData.title)} onChange={handleInputChange}/>
    <textarea name={"description"} value={componentData.description} onChange={handleInputChange}/>
    <input type={"text"} name={"heroImage"} value={componentData.heroImage} onChange={handleInputChange}/>
  </div>
}