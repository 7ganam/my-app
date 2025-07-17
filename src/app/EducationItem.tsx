import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EducationItemProps {
  degree?: string;
  year?: string;
  school?: string;
}

function EducationItem({
  degree = "Bachelor of Computer Science",
  year = "2012 - 2016",
  school = "University Name",
}: EducationItemProps) {
  // Degree editor
  const degreeEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${degree}</p>`,
    immediatelyRender: false,
  });

  // Year editor
  const yearEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${year}</p>`,
    immediatelyRender: false,
  });

  // School editor
  const schoolEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${school}</p>`,
    immediatelyRender: false,
  });

  return (
    <div className="sub-item bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 w-full">
      <div className="mb-3">
        <div
          className="editor-container"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <EditorContent
            editor={degreeEditor}
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#374151",
              letterSpacing: "-0.025em",
              lineHeight: "1.3",
              outline: "none",
              border: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              cursor: "text",
            }}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div
            className="editor-container"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <EditorContent
              editor={yearEditor}
              style={{
                fontSize: "14px",
                color: "#6b7280",
                fontStyle: "normal",
                fontWeight: "500",
                outline: "none",
                border: "none",
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: "0.025em",
                cursor: "text",
              }}
            />
          </div>
        </div>
        <div className="flex-1 text-right">
          <div
            className="editor-container"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <EditorContent
              editor={schoolEditor}
              style={{
                fontSize: "15px",
                color: "#4b5563",
                fontWeight: "600",
                outline: "none",
                border: "none",
                fontFamily: "Inter, system-ui, sans-serif",
                letterSpacing: "0.025em",
                cursor: "text",
              }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .sub-item :global(.ProseMirror) {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          cursor: text !important;
          min-height: 20px !important;
        }
        .sub-item :global(.ProseMirror:focus) {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .sub-item :global(.ProseMirror p) {
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

export default EducationItem;
