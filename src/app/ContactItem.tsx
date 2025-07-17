import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ContactItemProps {
  icon: string;
  label: string;
  value: string;
  id: string;
}

function ContactItem({ icon, label, value, id }: ContactItemProps) {
  // Value editor
  const valueEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${value}</p>`,
    immediatelyRender: false,
    editable: true,
    onUpdate: ({ editor }) => {
      // Optional: Handle content updates here if needed
      console.log("Content updated:", editor.getHTML());
    },
  });

  return (
    <div className="contact-item bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 w-full">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </div>
          <div
            className="editor-container"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <EditorContent
              editor={valueEditor}
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                outline: "none",
                border: "none",
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: "1.4",
                cursor: "text",
              }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .contact-item :global(.ProseMirror) {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          cursor: text !important;
          min-height: 20px !important;
        }
        .contact-item :global(.ProseMirror:focus) {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .contact-item :global(.ProseMirror p) {
          margin: 0 !important;
          padding: 0 !important;
        }
        .editor-container {
          cursor: text;
        }
        .editor-container:hover {
          background-color: rgba(59, 130, 246, 0.05);
          border-radius: 4px;
          padding: 2px;
          margin: -2px;
        }
      `}</style>
    </div>
  );
}

export default ContactItem;
