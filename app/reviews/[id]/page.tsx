'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CodeEditor from '@/components/editor/CodeEditor';
import SuggestionListSimple from '@/components/review/SuggestionListSimple';
import DiffPanel from '@/components/editor/DiffPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Code2, 
  FileText, 
  GitCompare, 
  Download, 
  RefreshCw,
  Clock,
  Cpu
} from 'lucide-react';
import { useReviewStore } from '@/lib/store/reviewStore';
import { generateMockSuggestionStream } from '@/lib/utils/mockData';
import type { Suggestion } from '@/types/review.types';
import { cn } from '@/lib/utils';

export default function ReviewPage() {
  const params = useParams();
  const reviewId = params.id as string;
  
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const { 
    currentReview, 
    addSuggestion, 
    updateReviewStatus,
    updateCode 
  } = useReviewStore();

  // Simulate streaming suggestions
  useEffect(() => {
    if (!currentReview || currentReview.id !== reviewId) return;
    
    setIsStreaming(true);
    updateReviewStatus('processing');
    
    const stopStreaming = generateMockSuggestionStream(
      (suggestion) => {
        addSuggestion(suggestion);
        updateReviewStatus('partial');
      },
      () => {
        updateReviewStatus('complete');
        setIsStreaming(false);
      },
      { count: 8, interval: 1000 }
    );

    return () => stopStreaming();
  }, [reviewId]);

  const handleViewDiff = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    if (window.innerWidth < 1024) {
      setActiveTab('diff');
    }
  };

  const handleCodeChange = (newCode: string) => {
    updateCode(newCode);
  };

  if (!currentReview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading review...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Code2 className="h-6 w-6 text-primary" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Code Review</h1>
              <Badge variant="outline" className="text-xs">
                {currentReview.id}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {isStreaming ? (
                <Badge variant="secondary" className="gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  {currentReview.status}
                </Badge>
              ) : (
                <Badge variant="default">
                  {currentReview.status}
                </Badge>
              )}
            </div>
            
            {/* Metrics */}
            {currentReview.metrics && (
              <>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {(currentReview.metrics.processingTime / 1000).toFixed(1)}s
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  {currentReview.metrics.modelName}
                </div>
              </>
            )}
            
            {/* Actions */}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop layout (≥1024px) */}
        <div className="hidden lg:grid lg:grid-cols-12 h-full">
          {/* Code Editor - 7 cols */}
          <div className="col-span-7 border-r">
            <CodeEditor
              code={currentReview.code}
              language={currentReview.language}
              onCodeChange={handleCodeChange}
              className="h-full"
            />
          </div>
          
          {/* Suggestions List - 5 cols */}
          <div className="col-span-5 flex flex-col">
            {/* Upper: Suggestions */}
            <div className="flex-1 border-b overflow-hidden">
              <SuggestionListSimple
                suggestions={currentReview.suggestions}
                isLoading={isStreaming}
                onViewDiff={handleViewDiff}
              />
            </div>
            
            {/* Lower: Diff Panel */}
            <div className="h-1/3 overflow-hidden">
              <DiffPanel
                suggestion={selectedSuggestion}
                originalCode={currentReview.code}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Tablet layout (768-1023px) */}
        <div className="hidden md:grid md:grid-cols-2 lg:hidden h-full">
          <div className="border-r">
            <CodeEditor
              code={currentReview.code}
              language={currentReview.language}
              onCodeChange={handleCodeChange}
              className="h-full"
            />
          </div>
          <div className="overflow-hidden">
            <Tabs value="suggestions" className="h-full flex flex-col">
              <TabsList className="m-2">
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="diff">Diff</TabsTrigger>
              </TabsList>
              <TabsContent value="suggestions" className="flex-1 overflow-hidden mt-0">
                <SuggestionListSimple
                  suggestions={currentReview.suggestions}
                  isLoading={isStreaming}
                  onViewDiff={handleViewDiff}
                />
              </TabsContent>
              <TabsContent value="diff" className="flex-1 overflow-hidden mt-0">
                <DiffPanel
                  suggestion={selectedSuggestion}
                  originalCode={currentReview.code}
                  className="h-full"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mobile layout (<768px) */}
        <div className="md:hidden h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor" className="text-xs">
                <FileText className="h-4 w-4 mr-1" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="text-xs">
                <Code2 className="h-4 w-4 mr-1" />
                Suggest
              </TabsTrigger>
              <TabsTrigger value="diff" className="text-xs">
                <GitCompare className="h-4 w-4 mr-1" />
                Diff
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="flex-1 overflow-hidden mt-0">
              <CodeEditor
                code={currentReview.code}
                language={currentReview.language}
                onCodeChange={handleCodeChange}
                className="h-full"
              />
            </TabsContent>
            
            <TabsContent value="suggestions" className="flex-1 overflow-hidden mt-0">
              <SuggestionListSimple
                suggestions={currentReview.suggestions}
                isLoading={isStreaming}
                onViewDiff={handleViewDiff}
              />
            </TabsContent>
            
            <TabsContent value="diff" className="flex-1 overflow-hidden mt-0">
              <DiffPanel
                suggestion={selectedSuggestion}
                originalCode={currentReview.code}
                className="h-full"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}