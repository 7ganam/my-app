"use client";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

interface EditorItem {
  id: string;
  content: string;
  bgColor: string;
  styles: EditorStyles;
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
  const [items, setItems] = useState<EditorItem[]>([
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
        <SortableItem key={item.id}>
          <div
            className={`item ${item.bgColor} m-2 h-[200px] p-4 relative group`}
          >
            <div className="drag-handle absolute top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move z-10 bg-white rounded p-1 shadow-sm">
              ⋮⋮
            </div>
            <EditorComponent
              content={item.content}
              editorId={`editor${item.id}`}
              editorStyles={item.styles}
            />
          </div>
        </SortableItem>
      ))}
    </SortableList>
  );
}
