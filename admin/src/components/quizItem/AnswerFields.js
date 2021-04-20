export default function AnswerFields({id, answer, onInputChange}) {
  return (
    <>
      <label htmlFor={`field${id}`}>{id}: </label>
      <input id={id} type={"text"} name={"text"} value={answer.text} onChange={onInputChange}/>
      <textarea id={id} name={"reason"}  value={answer.reason} onChange={onInputChange}/>
    </>
  );
}