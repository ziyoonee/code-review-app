'use client';

import { useEffect, useRef, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useEditorStore } from '@/lib/store/editorStore';
import { useReviewStore } from '@/lib/store/reviewStore';
import type { Suggestion } from '@/types/review.types';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  language?: string;
  readOnly?: boolean;
  onCodeChange?: (value: string) => void;
  className?: string;
}

export default function CodeEditor({
  code,
  language = 'javascript',
  readOnly = false,
  onCodeChange,
  className
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<string[]>([]);
  
  const { setEditor, isDarkMode } = useEditorStore();
  const { currentReview, highlightedSuggestionId, highlightSuggestion } = useReviewStore();
  
  const suggestions = currentReview?.suggestions || [];

  // Initialize editor
  const handleEditorDidMount = useCallback((
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditor(editor);

    // Register keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      console.log('Ctrl+Enter pressed - Start review');
    });

    editor.addCommand(monaco.KeyCode.KeyJ, () => {
      navigateToNextSuggestion();
    });

    editor.addCommand(monaco.KeyCode.KeyK, () => {
      navigateToPrevSuggestion();
    });

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      const lineNumber = e.position.lineNumber;
      const suggestion = suggestions.find(s => 
        s.range.start <= lineNumber && s.range.end >= lineNumber
      );
      if (suggestion) {
        highlightSuggestion(suggestion.id);
      }
    });

    // Apply initial decorations
    applyDecorations(suggestions);
  }, [setEditor, suggestions]);

  // Apply decorations for suggestions
  const applyDecorations = useCallback((suggestions: Suggestion[]) => {
    if (!editorRef.current || !monacoRef.current) return;

    const newDecorations: editor.IModelDeltaDecoration[] = suggestions.map(suggestion => {
      const severityColor = getSeverityColor(suggestion.severity);
      
      return {
        range: new monacoRef.current!.Range(
          suggestion.range.start,
          suggestion.range.startColumn || 1,
          suggestion.range.end,
          suggestion.range.endColumn || Number.MAX_SAFE_INTEGER
        ),
        options: {
          isWholeLine: !suggestion.range.startColumn,
          className: `suggestion-highlight suggestion-${suggestion.severity}`,
          glyphMarginClassName: `glyph-${suggestion.severity}`,
          glyphMarginHoverMessage: {
            value: `**${suggestion.title}**\n\n${suggestion.rationale}`
          },
          hoverMessage: {
            value: `**${suggestion.title}**\n\n${suggestion.rationale}\n\n_Confidence: ${suggestion.confidence}%_`
          },
          overviewRuler: {
            color: severityColor,
            position: monacoRef.current!.editor.OverviewRulerLane.Right
          },
          minimap: {
            color: severityColor,
            position: monacoRef.current!.editor.MinimapPosition.Inline
          }
        }
      };
    });

    // Replace old decorations with new ones
    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, []);

  // Update decorations when suggestions change
  useEffect(() => {
    if (suggestions.length > 0) {
      applyDecorations(suggestions);
    }
  }, [suggestions, applyDecorations]);

  // Highlight specific suggestion
  useEffect(() => {
    if (!editorRef.current || !highlightedSuggestionId) return;

    const suggestion = suggestions.find(s => s.id === highlightedSuggestionId);
    if (suggestion) {
      editorRef.current.revealLineInCenter(suggestion.range.start);
      editorRef.current.setPosition({
        lineNumber: suggestion.range.start,
        column: suggestion.range.startColumn || 1
      });
    }
  }, [highlightedSuggestionId, suggestions]);

  // Navigate to next suggestion
  const navigateToNextSuggestion = useCallback(() => {
    if (!editorRef.current || suggestions.length === 0) return;

    const currentLine = editorRef.current.getPosition()?.lineNumber || 1;
    const nextSuggestion = suggestions.find(s => s.range.start > currentLine) || suggestions[0];
    
    if (nextSuggestion) {
      highlightSuggestion(nextSuggestion.id);
    }
  }, [suggestions, highlightSuggestion]);

  // Navigate to previous suggestion
  const navigateToPrevSuggestion = useCallback(() => {
    if (!editorRef.current || suggestions.length === 0) return;

    const currentLine = editorRef.current.getPosition()?.lineNumber || 1;
    const prevSuggestion = [...suggestions].reverse().find(s => s.range.start < currentLine) || suggestions[suggestions.length - 1];
    
    if (prevSuggestion) {
      highlightSuggestion(prevSuggestion.id);
    }
  }, [suggestions, highlightSuggestion]);

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    const colors = {
      critical: '#ef4444',
      major: '#f97316',
      minor: '#eab308',
      info: '#3b82f6'
    };
    return colors[severity as keyof typeof colors] || '#6b7280';
  };

  return (
    <div className={cn('relative h-full w-full border rounded-lg overflow-hidden', className)}>
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={(value) => onCodeChange?.(value || '')}
        onMount={handleEditorDidMount}
        theme={isDarkMode ? 'vs-dark' : 'light'}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
      
      {/* Custom styles for decorations */}
      <style jsx global>{`
        .suggestion-highlight {
          background-color: rgba(59, 130, 246, 0.1);
        }
        .suggestion-critical {
          background-color: rgba(239, 68, 68, 0.1);
          border-left: 3px solid #ef4444;
        }
        .suggestion-major {
          background-color: rgba(249, 115, 22, 0.1);
          border-left: 3px solid #f97316;
        }
        .suggestion-minor {
          background-color: rgba(234, 179, 8, 0.1);
          border-left: 3px solid #eab308;
        }
        .suggestion-info {
          background-color: rgba(59, 130, 246, 0.1);
          border-left: 3px solid #3b82f6;
        }
        .glyph-critical::before {
          content: '⚠';
          color: #ef4444;
          font-weight: bold;
        }
        .glyph-major::before {
          content: '●';
          color: #f97316;
        }
        .glyph-minor::before {
          content: '●';
          color: #eab308;
        }
        .glyph-info::before {
          content: 'ℹ';
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
}