import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function SubItem() {
  // Title editor
  const titleEditor = useEditor({
    extensions: [StarterKit],
    content: "<p>Senior Software Engineer</p>",
    immediatelyRender: false,
  });

  // Date editor
  const dateEditor = useEditor({
    extensions: [StarterKit],
    content: "<p>2020 - 2023</p>",
    immediatelyRender: false,
  });

  // Company editor
  const companyEditor = useEditor({
    extensions: [StarterKit],
    content: "<p>Company Name</p>",
    immediatelyRender: false,
  });

  return (
    <div className="sub-item bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      <div className="mb-4">
        <EditorContent
          editor={titleEditor}
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1a202c",
            letterSpacing: "-0.025em",
            lineHeight: "1.3",
            outline: "none",
            border: "none",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <EditorContent
            editor={dateEditor}
            style={{
              fontSize: "15px",
              color: "#718096",
              fontStyle: "normal",
              fontWeight: "500",
              outline: "none",
              border: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: "0.025em",
            }}
          />
        </div>
        <div className="flex-1 text-right">
          <EditorContent
            editor={companyEditor}
            style={{
              fontSize: "16px",
              color: "#4a5568",
              fontWeight: "600",
              outline: "none",
              border: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: "0.025em",
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .sub-item :global(.ProseMirror) {
          outline: none !important;
          border: none !important;
          background: transparent !important;
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
        .sub-item:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default SubItem;
