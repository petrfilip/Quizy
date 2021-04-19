import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "gray",
    padding: "10px",
    margin: "10px"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.item.text}
    </div>
  );
}