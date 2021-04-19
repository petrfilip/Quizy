import { useState } from "react";

export default function QuizItemEditor({ question }) {


  const [data, setData] = useState(question)

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    data[name] = value

    const newData = Object.assign({}, data);
    setData(newData)
  }

  return <div>
    <select value={data.type} name={"type"} onChange={handleInputChange}>
      <option value={"pickOne"}>Pick one</option>
      <option value={"pickOneSourceCode"}>Pick one (source code)</option>
      <option value={"pickMultiple"}>Pick multiple</option>
      <option value={"sequence"}>Sequence</option>
    </select>

    <textarea name={"question"} value={data.question} onChange={handleInputChange} />

    <button>Submit</button>

  </div>
}