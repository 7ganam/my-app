"use client";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import Tiptap from "./Tiptap";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export default function RightColumn() {
  const [items, setItems] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
  ]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };
  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="list"
      draggedItemClassName="dragged"
    >
      {items.map((item) => (
        <SortableItem key={item}>
          <div className="item">{item}</div>
        </SortableItem>
      ))}
    </SortableList>
  );
}
