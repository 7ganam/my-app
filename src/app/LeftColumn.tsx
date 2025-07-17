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
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ContactItem from "./ContactItem";

interface ContactInfo {
  id: string;
  icon: string;
  label: string;
  value: string;
}

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
    <li ref={setNodeRef} style={style} {...attributes} className="item mb-3">
      <div className="relative group">
        <div
          className="absolute -left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-move"
          {...listeners}
        >
          <div className="bg-gray-200 rounded p-1 shadow-sm">
            <span className="text-xs text-gray-600">⋮⋮</span>
          </div>
        </div>
        {children}
      </div>
    </li>
  );
}

export default function LeftColumn() {
  const [contacts, setContacts] = useState<ContactInfo[]>([
    {
      id: "email",
      icon: "📧",
      label: "Email",
      value: "john.doe@email.com",
    },
    {
      id: "phone",
      icon: "📱",
      label: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      id: "location",
      icon: "📍",
      label: "Location",
      value: "San Francisco, CA",
    },
    {
      id: "linkedin",
      icon: "💼",
      label: "LinkedIn",
      value: "linkedin.com/in/johndoe",
    },
    {
      id: "github",
      icon: "🐙",
      label: "GitHub",
      value: "github.com/johndoe",
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
      setContacts((contacts) => {
        const oldIndex = contacts.findIndex(
          (contact) => contact.id === active.id
        );
        const newIndex = contacts.findIndex(
          (contact) => contact.id === over.id
        );

        return arrayMove(contacts, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="p-4 bg-gradient-to-b from-indigo-50 to-purple-50 h-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Contact Information
        </h2>
        <div className="w-12 h-1 bg-indigo-400 rounded"></div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={contacts.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="list space-y-3">
            {contacts.map((contact) => (
              <SortableItem key={contact.id} id={contact.id}>
                <ContactItem
                  id={contact.id}
                  icon={contact.icon}
                  label={contact.label}
                  value={contact.value}
                />
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
