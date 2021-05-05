import { useEffect, useLayoutEffect, useState } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import "./FlashCardItem.css"

export default function FlashCardItem({ flashcard }) {
  const [isTurned, setIsTurned] = useState(false)

  useLayoutEffect(() => {
    setIsTurned(false)
  }, [flashcard])

  return <div onClick={() => setIsTurned(!isTurned)} className={"card"}>
    {!isTurned ?
    <div className={"card-not-flipped"}>
      <h3>{flashcard.title}</h3>
      <div className={"card-flip-area"}>Flip the card</div>
    </div> :
    <div>
      <h3>{flashcard.title}</h3>
      <MarkdownPreview source={flashcard.description}/>
    </div>
  }</div>

}