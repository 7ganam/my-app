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
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <SortableList
        onSortEnd={onSortEnd}
        className="nested-list"
        draggedItemClassName="dragged"
      >
        {items.map((item, index) => (
          <SortableItem key={index}>
            <div className="nested-item rounded m-1 relative group/nested">
              <div className="drag-handle absolute top-2 -left-2 opacity-0 group-hover/nested:opacity-100 transition-opacity duration-200 cursor-move z-10 bg-gray-200 rounded p-1 shadow-sm text-xs">
                ⋮⋮
              </div>
              <div
                className="pl-4"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {item}
              </div>
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </div>
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
      bgColor: "",
      styles: {
        fontSize: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#374151",
        backgroundColor: "transparent",
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
      bgColor: "",
      styles: {
        fontSize: "20px",
        fontFamily: "Inter, sans-serif",
        color: "#374151",
        backgroundColor: "transparent",
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
    <div className="p-4 bg-gradient-to-b from-indigo-50 to-purple-50 h-full">
      <SortableList
        onSortEnd={onSortEnd}
        className="list space-y-6"
        draggedItemClassName="dragged"
      >
        {items.map((item) => (
          <SortableItem key={item.id}>
            <div className="item m-2 p-4 relative group/parent">
              <div className="drag-handle absolute top-2 -left-2 opacity-0 group-hover/parent:opacity-100 transition-opacity duration-200 cursor-move z-10 bg-gray-200 rounded p-1 shadow-sm">
                ⋮⋮
              </div>
              <div
                className="mb-4"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  <EditorComponent
                    content={item.content}
                    editorId={`editor${item.id}`}
                    editorStyles={item.styles}
                  />
                </h2>
                <div className="w-12 h-1 bg-indigo-400 rounded"></div>
              </div>

              {item.nestedItems && onNestedSortEnd && (
                <div
                  className="mt-4 flex-shrink-0"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  <NestedSortableList
                    items={item.nestedItems}
                    onSortEnd={(oldIndex: number, newIndex: number) =>
                      onNestedSortEnd(item.id, oldIndex, newIndex)
                    }
                  />
                </div>
              )}
            </div>
          </SortableItem>
        ))}
      </SortableList>
    </div>
  );
}
