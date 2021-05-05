import { useState, useLayoutEffect } from "react";
// import "./PickSequence.css"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from "./SortableItem";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";

export default function SimpleSequence({ questionItem, selectedItem, onSubmit }) {
  const {  answers, correct } = questionItem;

  const [selected, setSelected] = useState(selectedItem || answers)
  const [isSubmitted, setIsSubmitted] = useState(selectedItem)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useLayoutEffect(() => {
    setIsSubmitted(selectedItem || false)
    setSelected(selectedItem || answers)
  }, [questionItem.id])

  const isCorrect = (selected) => {
    return true
  }

  const onSubmitHandler = () => {
    setIsSubmitted(true)
    setSelected(selected);
    onSubmit(questionItem, selected, isCorrect(selected));
  }

  return (
    <>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}

      >
        <SortableContext

          items={selected}
          strategy={verticalListSortingStrategy}
        >
          {isSubmitted && selected.map(item => <div>{item.text}</div>)}
          {!isSubmitted && selected.map(item => <SortableItem key={item.id} id={item} item={item}/>)}
        </SortableContext>
      </DndContext>
      <button onClick={() => {
        if (isSubmitted) {
          return
        }
        onSubmitHandler()
      }
      }
      >
        {!isSubmitted && "Hotovo"}
        {isSubmitted && isCorrect() && "Správně"}
        {isSubmitted && !isCorrect() && "Chyba"}
      </button>

    </>)

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelected((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}