"use client";
import { useState, useMemo } from "react";
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
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

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
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 bg-white border border-gray-300 rounded-lg shadow-sm"
    >
      {/* Drag handle - separate from editor */}
      <div
        {...attributes}
        {...listeners}
        className="bg-gray-100 p-2 cursor-grab active:cursor-grabbing border-b border-gray-200 rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1">
            <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
          </div>
          <span className="text-sm text-gray-600">Editor {id}</span>
        </div>
      </div>

      {/* Editor content - not draggable */}
      <div
        className="p-4"
        onMouseDown={(e) => {
          // Prevent event bubbling to drag handlers when clicking in editor area
          e.stopPropagation();
        }}
        onMouseMove={(e) => {
          // Prevent cursor from leaving editor during text selection
          if (e.buttons === 1) {
            // Left mouse button is down
            e.stopPropagation();
          }
        }}
        onMouseUp={(e) => {
          // Clean up after text selection
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}

function EditorComponent({ editor }: { editor: any }) {
  return (
    <div
      style={{ minHeight: "300px" }}
      onMouseDown={(e) => {
        // Prevent drag activation when clicking in editor
        e.stopPropagation();
      }}
      onMouseMove={(e) => {
        // Keep cursor contained during text selection
        if (e.buttons === 1) {
          e.stopPropagation();
        }
      }}
    >
      <BlockNoteView
        editor={editor}
        style={{ minHeight: "300px" }}
        onMouseDown={(e) => {
          // Additional protection for BlockNoteView
          e.stopPropagation();
        }}
      />
    </div>
  );
}

export default function RightColumn() {
  const [items, setItems] = useState(["editor-1", "editor-2", "editor-3"]);

  // Create 3 separate editor instances at the top level
  const editor1 = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "This is editor 1. Type something unique here...",
      },
    ],
  });

  const editor2 = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "This is editor 2. It has different content...",
      },
    ],
  });

  const editor3 = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "This is editor 3. Each editor is independent...",
      },
    ],
  });

  // Map editor IDs to their corresponding editor instances
  const editorMap: Record<string, any> = {
    "editor-1": editor1,
    "editor-2": editor2,
    "editor-3": editor3,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
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
    <div className="flex-1 p-4 overflow-y-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {items.map((item) => (
              <SortableItem key={item} id={item}>
                <EditorComponent editor={editorMap[item]} />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
