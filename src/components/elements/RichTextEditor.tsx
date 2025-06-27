"use client";

import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import clsx from "clsx";
import { Bold, Italic, Palette, Underline } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PRESET_COLORS = [
  "#000000",
  "#EF4444",
  "#3B82F6",
  "#22C55E",
  "#EC4899",
  "#A855F7",
  "#EAB308",
];

interface RichTextEditorProps {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

function RichTextEditor({
  html,
  onChange,
  placeholder = "Type here...",
  className,
}: RichTextEditorProps) {
  // Refs
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const paletteButtonRef = useRef<HTMLButtonElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // States
  const [isMounted, setIsMounted] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder }),
    ],
    content: html,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    onSelectionUpdate: ({ editor }) => {
      setShowToolbar(!editor.state.selection.empty);
    },
  });

  // Update the editor content when the html prop changes
  useEffect(() => {
    if (editor && html !== editor.getHTML()) {
      editor.commands.setContent(html, false);
    }
  }, [html, editor]);

  // Update the toolbar position when the selection changes
  useEffect(() => {
    if (
      showToolbar &&
      toolbarRef.current &&
      editorWrapperRef.current &&
      editor
    ) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      const selectionRect = range.getBoundingClientRect();
      const editorRect = editorWrapperRef.current.getBoundingClientRect();
      const toolbarHeight = toolbarRef.current.offsetHeight;
      const toolbarWidth = toolbarRef.current.offsetWidth;
      const top =
        selectionRect.top -
        editorRect.top +
        editorWrapperRef.current.scrollTop -
        toolbarHeight -
        4;
      const left =
        selectionRect.left -
        editorRect.left +
        selectionRect.width / 2 -
        toolbarWidth / 2;
      setToolbarPosition({
        top,
        left: Math.max(8, Math.min(left, editorRect.width - toolbarWidth - 8)),
      });
    }
  }, [showToolbar, editor]);

  // Handle clicks outside the editor to close the toolbar and palette
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      const wrapper = editorWrapperRef.current;
      const toolbar = toolbarRef.current;
      const palette = paletteRef.current;

      // If the click is on the toolbar or the palette, let their own handlers manage it.
      if (toolbar?.contains(target) || palette?.contains(target)) {
        return;
      }

      // If the click is inside the editor wrapper (but not the toolbar, as checked above),
      // it means the user clicked the padding or the editor content.
      // The selection will collapse, and onSelectionUpdate will hide the toolbar.
      // We only need to ensure the palette also closes.
      if (wrapper?.contains(target)) {
        setShowColorPalette(false);
        return;
      }

      // If we reach here, the click was truly outside all our UI. Close everything.
      setShowToolbar(false);
      setShowColorPalette(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Set the mounted state to true after the component mounts
  useEffect(() => setIsMounted(true), []);

  // Handle the color palette button click
  const handlePaletteClick = () => {
    if (!paletteButtonRef.current) return;
    const rect = paletteButtonRef.current.getBoundingClientRect();
    const paletteWidthEstimate = 200;
    let left = rect.left;
    if (rect.left + paletteWidthEstimate > window.innerWidth) {
      left = rect.right - paletteWidthEstimate;
    }
    setPalettePosition({ top: rect.bottom + 8, left: Math.max(8, left) });
    setShowColorPalette((prev) => !prev);
  };

  // Return null if the editor is not initialized
  if (!editor) return null;

  return (
    <div
      ref={editorWrapperRef}
      className={clsx("relative h-full w-full", className)}
    >
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className={clsx(
          "absolute z-10 flex items-center space-x-1 rounded-xl border border-neutral-300 bg-white p-1",
          {
            "opacity-100": showToolbar,
            "pointer-events-none opacity-0": !showToolbar,
          },
        )}
        style={{
          top: `${toolbarPosition.top}px`,
          left: `${toolbarPosition.left}px`,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <button
          onClick={() => {
            editor.chain().focus().toggleBold().run();
            setShowColorPalette(false);
          }}
          className={clsx("toolbar-btn", {
            "is-active": editor.isActive("bold"),
          })}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
            setShowColorPalette(false);
          }}
          className={clsx("toolbar-btn", {
            "is-active": editor.isActive("italic"),
          })}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
            setShowColorPalette(false);
          }}
          className={clsx("toolbar-btn", {
            "is-active": editor.isActive("underline"),
          })}
        >
          <Underline size={16} />
        </button>
        <div className="relative">
          <button
            ref={paletteButtonRef}
            onClick={handlePaletteClick}
            className="toolbar-btn"
          >
            <Palette size={16} />
          </button>
        </div>
      </div>

      {/* Color Palette */}
      {isMounted &&
        showColorPalette &&
        createPortal(
          <div
            ref={paletteRef}
            className="fixed z-50 flex gap-1 rounded-xl border border-neutral-300 bg-white p-2"
            style={{
              top: `${palettePosition.top}px`,
              left: `${palettePosition.left}px`,
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColorPalette(false);
                }}
                className="h-5 w-5 cursor-pointer rounded-full hover:scale-120"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>,
          document.body,
        )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="font-mali h-full w-full" />
    </div>
  );
}

export default RichTextEditor;
