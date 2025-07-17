import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ExperienceItemProps {
  title?: string;
  date?: string;
  company?: string;
}

function ExperienceItem({
  title = "Senior Software Engineer",
  date = "2020 - 2023",
  company = "Company Name",
}: ExperienceItemProps) {
  // Title editor
  const titleEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${title}</p>`,
    immediatelyRender: false,
  });

  // Date editor
  const dateEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${date}</p>`,
    immediatelyRender: false,
  });

  // Company editor
  const companyEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${company}</p>`,
    immediatelyRender: false,
  });

  return (
    <div className="sub-item bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 backdrop-blur-sm w-full">
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
      `}</style>
    </div>
  );
}

export default ExperienceItem;
