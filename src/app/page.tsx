"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LeftColumn from "./LeftColumn";
import RightColumn from "./RightColumn";
import ProfileHeader from "./ProfileHeader";
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="item"
    >
      {children}
    </li>
  );
}

export default function Home() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
  const [items2, setItems2] = useState([
    "Item 11",
    "Item 22",
    "Item 33",
    "Item 44",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragEnd2(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems2((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  const editor = useCreateBlockNote();

  return (
    <div className="min-h-screen flex flex-col container mx-auto">
      {/* <BlockNoteView editor={editor} /> */}
      <div className="title bg-gradient-to-b from-indigo-50 to-purple-50 h-[140px] flex items-center justify-center p-4">
        <ProfileHeader
          name="John Doe"
          intro="Passionate software engineer with 5+ years of experience building scalable web applications and leading development teams."
        />
      </div>
      <div className="flex bg-gradient-to-b from-indigo-50 to-purple-50 w-full flex-1 min-h-0">
        <div className="w-1/4">
          <LeftColumn />
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}
