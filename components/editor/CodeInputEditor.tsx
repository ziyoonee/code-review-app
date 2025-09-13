"use client";

import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeInputEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  placeholder?: string;
}

export function CodeInputEditor({
  value,
  onChange,
  language = "javascript",
  placeholder = "// Paste your code here...",
}: CodeInputEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value || placeholder}
        onChange={onChange}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollBeyondLastLine: false,
          folding: true,
          wordWrap: "on",
          automaticLayout: true,
          padding: { top: 10, bottom: 10 },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
        onMount={(editor) => {
          // Clear placeholder on focus if it's the default
          editor.onDidFocusEditorText(() => {
            if (editor.getValue() === placeholder) {
              editor.setValue("");
            }
          });

          // Restore placeholder on blur if empty
          editor.onDidBlurEditorText(() => {
            if (!editor.getValue().trim()) {
              editor.setValue(placeholder);
            }
          });
        }}
      />
    </div>
  );
}