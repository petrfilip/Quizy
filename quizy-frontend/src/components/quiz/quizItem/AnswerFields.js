
import MarkdownPreview from "@uiw/react-markdown-preview";
import SyntaxHighlighter from "react-syntax-highlighter"; //Example style, you can use another

export default function AnswerFields({ id, content, answerType }) {


  const markdown = <MarkdownPreview source={content || ""}/>
  const simpleInput = <MarkdownPreview source={content || ""}/>
  const codeEditor = <div>{content}</div>
  // const codeEditor = <SyntaxHighlighter language="javascript">
  //   {answer.text}
  // </SyntaxHighlighter>

  return (
    <>
      {answerType === "simpleInput" && simpleInput}
      {answerType === "codeEditor" && codeEditor}
      {answerType === "markdown" && markdown}
    </>
  );
}