'use client';

import { useEffect, useRef, useState } from 'react';
import { html } from 'diff2html';
import { createPatch } from 'diff';
import 'diff2html/bundles/css/diff2html.min.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Suggestion } from '@/types/review.types';

interface DiffPanelProps {
  suggestion?: Suggestion | null;
  originalCode: string;
  modifiedCode?: string;
  onApply?: () => void;
  onReject?: () => void;
  className?: string;
}

export default function DiffPanel({
  suggestion,
  originalCode,
  modifiedCode,
  onApply,
  onReject,
  className
}: DiffPanelProps) {
  const [copied, setCopied] = useState(false);
  const diffContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!suggestion || !diffContainerRef.current) return;

    let diffString = '';
    
    if (suggestion.fix?.diff) {
      // Use provided diff
      diffString = suggestion.fix.diff;
    } else if (modifiedCode) {
      // Generate diff from original and modified code
      diffString = createPatch(
        'code',
        originalCode,
        modifiedCode,
        'Original',
        'Modified'
      );
    }

    if (diffString) {
      const diffHtml = html(diffString, {
        drawFileList: false,
        matching: 'lines',
        outputFormat: 'line-by-line', // Using unified view as per PRD
        renderNothingWhenEmpty: false,
      });

      diffContainerRef.current.innerHTML = diffHtml;
    }
  }, [suggestion, originalCode, modifiedCode]);

  const handleCopy = () => {
    if (suggestion?.fix?.diff) {
      navigator.clipboard.writeText(suggestion.fix.diff);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!suggestion) {
    return (
      <Card className={cn('h-full', className)}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <p>Select a suggestion to view the diff</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base">{suggestion.title}</CardTitle>
            <CardDescription className="text-xs">
              Line {suggestion.range.start}
              {suggestion.range.end !== suggestion.range.start && 
                ` - ${suggestion.range.end}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {suggestion.severity}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        <div 
          ref={diffContainerRef}
          className="diff-container min-h-full"
        />
        
        {/* Custom styles for diff2html */}
        <style jsx global>{`
          .diff-container {
            font-family: var(--font-mono);
            font-size: 13px;
          }
          
          .d2h-wrapper {
            border: none;
          }
          
          .d2h-file-header {
            display: none;
          }
          
          .d2h-code-wrapper {
            border: none;
          }
          
          .d2h-diff-table {
            border: none;
            box-shadow: none;
          }
          
          .d2h-code-line {
            padding: 0 10px;
            line-height: 1.5;
          }
          
          .d2h-code-side-linenumber {
            background: transparent;
            color: var(--muted-foreground);
            border: none;
            padding: 0 8px;
            min-width: 40px;
          }
          
          .d2h-del {
            background-color: rgba(239, 68, 68, 0.1);
          }
          
          .d2h-ins {
            background-color: rgba(34, 197, 94, 0.1);
          }
          
          .d2h-code-line-prefix {
            display: inline-block;
            width: 20px;
            text-align: center;
          }
          
          .dark .d2h-code-line {
            background: transparent;
          }
          
          .dark .d2h-del {
            background-color: rgba(239, 68, 68, 0.15);
          }
          
          .dark .d2h-ins {
            background-color: rgba(34, 197, 94, 0.15);
          }
        `}</style>
      </CardContent>

      {suggestion.status === 'pending' && (onApply || onReject) && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            {onApply && (
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={onApply}
              >
                <Check className="h-4 w-4 mr-1" />
                Apply Changes
              </Button>
            )}
            {onReject && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={onReject}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}