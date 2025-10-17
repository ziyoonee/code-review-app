/**
 * Editor-related type definitions
 */

import type { editor } from 'monaco-editor';

export interface EditorDecoration {
  id: string;
  range: editor.IRange;
  options: editor.IModelDecorationOptions;
  suggestionId: string;
}

export interface EditorHoverContent {
  title: string;
  rationale: string;
  severity: string;
  tags: string[];
  confidence: number;
}

export interface EditorPosition {
  lineNumber: number;
  column: number;
}

export interface EditorSelection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface EditorTheme {
  base: 'vs' | 'vs-dark' | 'hc-black';
  inherit: boolean;
  rules: editor.ITokenThemeRule[];
  colors: Record<string, string>;
}

export interface EditorKeyBinding {
  key: string;
  command: string;
  when?: string;
}

export interface EditorOptions {
  readOnly?: boolean;
  language?: string;
  theme?: string;
  fontSize?: number;
  lineNumbers?: 'on' | 'off' | 'relative';
  minimap?: {
    enabled: boolean;
  };
  scrollBeyondLastLine?: boolean;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  automaticLayout?: boolean;
}

export interface DiffViewOptions {
  mode: 'unified' | 'side-by-side';
  context: number;
  showLineNumbers: boolean;
  showFilePath: boolean;
}

export interface CodePatch {
  oldCode: string;
  newCode: string;
  diff: string;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  content: string;
}