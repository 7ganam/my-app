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
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="item relative group"
    >
      <div
        className="drag-handle absolute top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move z-10 bg-white rounded p-1 shadow-sm"
        {...listeners}
      >
        ⋮⋮
      </div>
      {children}
    </li>
  );
}

interface EditorStyles {
  fontSize?: string;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  border?: string;
  lineHeight?: string;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
}

// Individual editor component to isolate each editor instance
function EditorComponent({
  content,
  editorId,
  editorStyles,
}: {
  content: string;
  editorId: string;
  editorStyles?: EditorStyles;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
  });

  const defaultStyles: EditorStyles = {
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    color: "#000",
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    lineHeight: "1.5",
    fontWeight: "normal",
    textAlign: "left",
  };

  const mergedStyles = { ...defaultStyles, ...editorStyles };

  return (
    <div
      className="editor-wrapper h-full"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div style={mergedStyles}>
        <EditorContent
          editor={editor}
          style={{
            outline: "none",
            border: "none",
          }}
        />
      </div>
      <style jsx>{`
        .editor-wrapper :global(.ProseMirror) {
          outline: none !important;
          border: none !important;
        }
        .editor-wrapper :global(.ProseMirror:focus) {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}

export default function RightColumn() {
  const [items, setItems] = useState([
    {
      id: "1",
      content: "<p>Editor 1 Content</p>",
      bgColor: "bg-red-500",
      styles: {
        fontSize: "16px",
        fontFamily: "Georgia, serif",
        color: "#2c3e50",
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        textAlign: "center" as const,
      },
    },
    {
      id: "2",
      content: "<p>Editor 2 Content</p>",
      bgColor: "bg-blue-500",
      styles: {
        fontSize: "18px",
        fontFamily: "Monaco, monospace",
        color: "#e74c3c",
        backgroundColor: "#ecf0f1",
        lineHeight: "1.8",
        textAlign: "left" as const,
      },
    },
    {
      id: "3",
      content: "<p>Editor 3 Content</p>",
      bgColor: "bg-green-500",
      styles: {
        fontSize: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#27ae60",
        backgroundColor: "#fff",
        fontWeight: "300",
        textAlign: "right" as const,
        border: "2px solid #27ae60",
        borderRadius: "8px",
      },
    },
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
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

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
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list flex-3">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className={`item ${item.bgColor} m-2 h-[200px] p-4`}>
                  <EditorComponent
                    content={item.content}
                    editorId={`editor${item.id}`}
                    editorStyles={item.styles}
                  />
                </div>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
