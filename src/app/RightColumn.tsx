"use client";
import { useState } from "react";
import Tiptap from "./Tiptap";

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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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
    <li ref={setNodeRef} style={style} {...attributes} className="item">
      <div
        className="drag-handle bg-gray-300 h-8 cursor-move mb-2"
        {...listeners}
      >
        ⋮⋮ Drag Handle
      </div>
      {children}
    </li>
  );
}

// Individual editor component to isolate each editor instance
function EditorComponent({
  content,
  editorId,
}: {
  content: string;
  editorId: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
  });

  return (
    <div
      className="editor-wrapper h-full"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

export default function RightColumn() {
  const [items, setItems] = useState(["1", "2", "3"]);

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

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="list flex-3">
            <SortableItem key={1} id={"1"}>
              <div className="item bg-red-500 m-2 h-[200px] p-4">
                <EditorComponent
                  content="<p>Editor 1 Content</p>"
                  editorId="editor1"
                />
              </div>
            </SortableItem>
            <SortableItem key={2} id={"2"}>
              <div className="item bg-blue-500 m-2 h-[200px] p-4">
                <EditorComponent
                  content="<p>Editor 2 Content</p>"
                  editorId="editor2"
                />
              </div>
            </SortableItem>
            <SortableItem key={3} id={"3"}>
              <div className="item bg-green-500 m-2 h-[200px] p-4">
                <EditorComponent
                  content="<p>Editor 3 Content</p>"
                  editorId="editor3"
                />
              </div>
            </SortableItem>
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
