"use client";
import React, { useState } from "react";

type Item = {
  id: string;
  label: string;
};

const defaultItems: Item[] = [
  { id: "task-1", label: "Organize a team-building event" },
  { id: "task-2", label: "Create and maintain office inventory" },
  { id: "task-3", label: "Update company website content" },
  { id: "task-4", label: "Plan and execute marketing campaigns" },
  { id: "task-5", label: "Coordinate employee training sessions" },
  { id: "task-6", label: "Manage facility maintenance" },
  { id: "task-7", label: "Organize customer feedback surveys" },
  { id: "task-8", label: "Coordinate travel arrangements" },
];

export default function SimpleDragAndDrop() {
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetItem: Item) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      return;
    }

    const draggedIndex = items.findIndex((item) => item.id === draggedItem.id);
    const targetIndex = items.findIndex((item) => item.id === targetItem.id);

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    setItems(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Simple Drag & Drop List
      </h2>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item)}
            onDragEnd={handleDragEnd}
            className={`
              p-4 border-b border-gray-100 cursor-move
              hover:bg-gray-50 transition-colors
              ${draggedItem?.id === item.id ? "opacity-50 bg-blue-50" : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-700">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
