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
    <div className="profile-header bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 shadow-lg border border-green-200 w-full">
      <div className="text-center mb-6">
        <EditorContent
          editor={nameEditor}
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#065f46",
            letterSpacing: "-0.025em",
            lineHeight: "1.2",
            outline: "none",
            border: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
          }}
        />
      </div>
      <div className="max-w-4xl mx-auto">
        <EditorContent
          editor={introEditor}
          style={{
            fontSize: "18px",
            color: "#047857",
            fontWeight: "400",
            outline: "none",
            border: "none",
            fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: "1.6",
            textAlign: "center",
          }}
        />
      </div>
      <style jsx>{`
        .profile-header :global(.ProseMirror) {
          outline: none !important;
          border: none !important;
          background: transparent !important;
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
      `}</style>
    </div>
  );
}

export default ProfileHeader;
