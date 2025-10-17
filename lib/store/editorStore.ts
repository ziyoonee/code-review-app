import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EditorDecoration, EditorPosition, EditorOptions } from '@/types/editor.types';
import type { editor } from 'monaco-editor';

interface EditorStore {
  // State
  editorInstance: editor.IStandaloneCodeEditor | null;
  decorations: EditorDecoration[];
  cursorPosition: EditorPosition;
  selectedRange: editor.IRange | null;
  isDarkMode: boolean;
  editorOptions: EditorOptions;
  
  // Actions
  setEditor: (editor: editor.IStandaloneCodeEditor) => void;
  setDecorations: (decorations: EditorDecoration[]) => void;
  addDecoration: (decoration: EditorDecoration) => void;
  removeDecoration: (id: string) => void;
  clearDecorations: () => void;
  setCursorPosition: (position: EditorPosition) => void;
  setSelectedRange: (range: editor.IRange | null) => void;
  toggleTheme: () => void;
  updateEditorOptions: (options: Partial<EditorOptions>) => void;
  goToLine: (lineNumber: number) => void;
  insertText: (text: string, position?: EditorPosition) => void;
  replaceText: (range: editor.IRange, text: string) => void;
}

const defaultEditorOptions: EditorOptions = {
  readOnly: false,
  language: 'javascript',
  theme: 'vs-dark',
  fontSize: 14,
  lineNumbers: 'on',
  minimap: {
    enabled: true
  },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  automaticLayout: true
};

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      editorInstance: null,
      decorations: [],
      cursorPosition: { lineNumber: 1, column: 1 },
      selectedRange: null,
      isDarkMode: true,
      editorOptions: defaultEditorOptions,

      // Actions
      setEditor: (editor) => 
        set({ editorInstance: editor }),

      setDecorations: (decorations) => {
        const editor = get().editorInstance;
        if (editor) {
          const monacoDecorations = decorations.map(d => ({
            range: d.range,
            options: d.options
          }));
          editor.deltaDecorations(
            get().decorations.map(d => d.id),
            monacoDecorations
          );
        }
        set({ decorations });
      },

      addDecoration: (decoration) => {
        const editor = get().editorInstance;
        if (editor) {
          const [id] = editor.deltaDecorations([], [{
            range: decoration.range,
            options: decoration.options
          }]);
          decoration.id = id;
        }
        set((state) => ({
          decorations: [...state.decorations, decoration]
        }));
      },

      removeDecoration: (id) => {
        const editor = get().editorInstance;
        if (editor) {
          editor.deltaDecorations([id], []);
        }
        set((state) => ({
          decorations: state.decorations.filter(d => d.id !== id)
        }));
      },

      clearDecorations: () => {
        const editor = get().editorInstance;
        if (editor) {
          editor.deltaDecorations(
            get().decorations.map(d => d.id),
            []
          );
        }
        set({ decorations: [] });
      },

      setCursorPosition: (position) => {
        const editor = get().editorInstance;
        if (editor) {
          editor.setPosition(position);
          editor.revealPositionInCenter(position);
        }
        set({ cursorPosition: position });
      },

      setSelectedRange: (range) => {
        const editor = get().editorInstance;
        if (editor && range) {
          editor.setSelection(range);
          editor.revealRangeInCenter(range);
        }
        set({ selectedRange: range });
      },

      toggleTheme: () => {
        const newTheme = get().isDarkMode ? 'vs' : 'vs-dark';
        const editor = get().editorInstance;
        if (editor) {
          editor.updateOptions({ theme: newTheme });
        }
        set((state) => ({
          isDarkMode: !state.isDarkMode,
          editorOptions: { ...state.editorOptions, theme: newTheme }
        }));
      },

      updateEditorOptions: (options) => {
        const editor = get().editorInstance;
        if (editor) {
          editor.updateOptions(options);
        }
        set((state) => ({
          editorOptions: { ...state.editorOptions, ...options }
        }));
      },

      goToLine: (lineNumber) => {
        const editor = get().editorInstance;
        if (editor) {
          editor.revealLineInCenter(lineNumber);
          editor.setPosition({ lineNumber, column: 1 });
          editor.focus();
        }
      },

      insertText: (text, position) => {
        const editor = get().editorInstance;
        const model = editor?.getModel();
        if (editor && model) {
          const pos = position || editor.getPosition() || { lineNumber: 1, column: 1 };
          editor.executeEdits('insert', [{
            range: {
              startLineNumber: pos.lineNumber,
              startColumn: pos.column,
              endLineNumber: pos.lineNumber,
              endColumn: pos.column
            },
            text
          }]);
        }
      },

      replaceText: (range, text) => {
        const editor = get().editorInstance;
        const model = editor?.getModel();
        if (editor && model) {
          editor.executeEdits('replace', [{
            range,
            text
          }]);
        }
      }
    }),
    {
      name: 'editor-store'
    }
  )
);