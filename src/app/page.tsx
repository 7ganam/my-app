"use client";
import { useState, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false);
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);
  const [items2, setItems2] = useState([
    "Item 11",
    "Item 22",
    "Item 33",
    "Item 44",
  ]);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return (
      <div className="w-[794px] h-[1123px] bg-white shadow-2xl rounded-xl mx-auto my-8 overflow-hidden flex">
        <div className="w-1/4">
          <div className="p-4 bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-200 h-full border-r border-gray-300 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">JD</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                John Doe
              </h3>
              <p className="text-sm text-gray-600">Software Engineer</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4">
            <ProfileHeader
              name="John Doe"
              intro="Passionate software engineer with 5+ years of experience building scalable web applications and leading development teams."
            />
          </div>
          <div className="flex-1 min-h-0">
            <div className="p-4 bg-gradient-to-b from-indigo-50 to-purple-50 h-full">
              <div className="space-y-6">
                <div className="item m-2 p-4">
                  <div className="mb-6">
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-gray-800">
                        Experience
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>
                <div className="item m-2 p-4">
                  <div className="mb-6">
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-gray-800">
                        Education
                      </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[794px] h-[1123px] bg-white shadow-2xl rounded-xl mx-auto my-8 overflow-hidden flex">
      <div className="w-1/4">
        <LeftColumn />
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4">
          <ProfileHeader
            name="John Doe"
            intro="Passionate software engineer with 5+ years of experience building scalable web applications and leading development teams."
          />
        </div>
        <div className="flex-1 min-h-0">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}
