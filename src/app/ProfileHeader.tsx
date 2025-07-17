import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ProfileHeaderProps {
  name?: string;
  intro?: string;
}

function ProfileHeader({
  name = "John Doe",
  intro = "Passionate software engineer with 5+ years of experience building scalable web applications and leading development teams.",
}: ProfileHeaderProps) {
  // Name editor
  const nameEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${name}</p>`,
    immediatelyRender: false,
  });

  // Intro editor
  const introEditor = useEditor({
    extensions: [StarterKit],
    content: `<p>${intro}</p>`,
    immediatelyRender: false,
  });

  return (
    <div className="profile-header bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 w-full">
      <div className="text-center mb-6">
        <div
          className="editor-container"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <EditorContent
            editor={nameEditor}
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#374151",
              letterSpacing: "-0.025em",
              lineHeight: "1.2",
              outline: "none",
              border: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              textAlign: "center",
              cursor: "text",
            }}
          />
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <div
          className="editor-container"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <EditorContent
            editor={introEditor}
            style={{
              fontSize: "18px",
              color: "#4b5563",
              fontWeight: "400",
              outline: "none",
              border: "none",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: "1.6",
              textAlign: "center",
              cursor: "text",
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .profile-header :global(.ProseMirror) {
          outline: none !important;
          border: none !important;
          background: transparent !important;
          cursor: text !important;
          min-height: 20px !important;
        }
        .profile-header :global(.ProseMirror:focus) {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .profile-header :global(.ProseMirror p) {
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

export default ProfileHeader;
