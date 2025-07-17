"use client";
import { useState } from "react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ExperienceItem from "./ExperienceItem";
import EducationItem from "./EducationItem";
import ProfileHeader from "./ProfileHeader";

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
  nestedItems?: React.ReactNode[];
}

// Nested sortable list component
function NestedSortableList({
  items,
  onSortEnd,
}: {
  items: React.ReactNode[];
  onSortEnd: (oldIndex: number, newIndex: number) => void;
}) {
  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="nested-list"
      draggedItemClassName="dragged"
    >
      {items.map((item, index) => (
        <SortableItem key={index}>
          <div className="nested-item rounded m-1 relative group/nested">
            <div className="drag-handle absolute top-1 -left-1 opacity-0 group-hover/nested:opacity-100 transition-opacity duration-200 cursor-move z-10 bg-gray-100 rounded p-1 shadow-sm text-xs">
              ⋮⋮
            </div>
            <div>{item}</div>
          </div>
        </SortableItem>
      ))}
    </SortableList>
  );
}

// Individual editor component to isolate each editor instance
function EditorComponent({
  content,
  editorId,
  editorStyles,
  nestedItems,
  onNestedSortEnd,
}: {
  content: string;
  editorId: string;
  editorStyles?: EditorStyles;
  nestedItems?: React.ReactNode[];
  onNestedSortEnd?: (oldIndex: number, newIndex: number) => void;
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
      className="editor-wrapper h-full flex flex-col"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div style={mergedStyles} className="flex-1 min-h-0">
        <EditorContent
          editor={editor}
          style={{
            outline: "none",
            border: "none",
          }}
        />
      </div>
      {nestedItems && onNestedSortEnd && (
        <div className="mt-4 flex-shrink-0">
          <NestedSortableList items={nestedItems} onSortEnd={onNestedSortEnd} />
        </div>
      )}
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
      content: "<p>Experience</p>",
      bgColor: "bg-red-500",
      styles: {
        fontSize: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#2c3e50",
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        textAlign: "left" as const,
      },
      nestedItems: [
        <ExperienceItem
          key="1"
          title="Senior Software Engineer"
          date="2020 - 2023"
          company="Google"
        />,
        <ExperienceItem
          key="2"
          title="Full Stack Developer"
          date="2018 - 2020"
          company="Microsoft"
        />,
        <ExperienceItem
          key="3"
          title="Frontend Developer"
          date="2016 - 2018"
          company="Apple"
        />,
      ],
    },
    {
      id: "2",
      content: "<p>Education</p>",
      bgColor: "bg-blue-500",
      styles: {
        fontSize: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#2c3e50",
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        textAlign: "left" as const,
      },
      nestedItems: [
        <EducationItem
          key="1"
          degree="Master of Computer Science"
          year="2014 - 2016"
          school="Stanford University"
        />,
        <EducationItem
          key="2"
          degree="Bachelor of Computer Science"
          year="2010 - 2014"
          school="UC Berkeley"
        />,
        <EducationItem
          key="3"
          degree="High School Diploma"
          year="2006 - 2010"
          school="Lincoln High School"
        />,
      ],
    },
  ]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setItems((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  const onNestedSortEnd = (
    itemId: string,
    oldIndex: number,
    newIndex: number
  ) => {
    setItems((array) => {
      return array.map((item) => {
        if (item.id === itemId && item.nestedItems) {
          return {
            ...item,
            nestedItems: arrayMoveImmutable(
              item.nestedItems,
              oldIndex,
              newIndex
            ),
          };
        }
        return item;
      });
    });
  };

  return (
    <SortableList
      onSortEnd={onSortEnd}
      className="list"
      draggedItemClassName="dragged"
    >
      {items.map((item) => (
        <SortableItem key={item.id}>
          <div className={`item ${item.bgColor} m-2 p-4 relative group/parent`}>
            <div className="drag-handle absolute top-2 -left-2 opacity-0 group-hover/parent:opacity-100 transition-opacity duration-200 cursor-move z-10 bg-white rounded p-1 shadow-sm">
              ⋮⋮
            </div>
            <EditorComponent
              content={item.content}
              editorId={`editor${item.id}`}
              editorStyles={item.styles}
              nestedItems={item.nestedItems}
              onNestedSortEnd={
                item.nestedItems
                  ? (oldIndex: number, newIndex: number) =>
                      onNestedSortEnd(item.id, oldIndex, newIndex)
                  : undefined
              }
            />
          </div>
        </SortableItem>
      ))}
    </SortableList>
  );
}
