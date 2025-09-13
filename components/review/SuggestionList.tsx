'use client';

import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import SuggestionCard from './SuggestionCard';
import FilterChips from './FilterChips';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Suggestion } from '@/types/review.types';
import { useReviewStore } from '@/lib/store/reviewStore';

interface SuggestionListProps {
  suggestions: Suggestion[];
  isLoading?: boolean;
  onViewDiff?: (suggestion: Suggestion) => void;
}

export default function SuggestionList({ 
  suggestions, 
  isLoading = false,
  onViewDiff 
}: SuggestionListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { filters, highlightedSuggestionId } = useReviewStore();

  // Filter suggestions based on active filters
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => {
      if (filters.severity.length > 0 && !filters.severity.includes(suggestion.severity)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(suggestion.status)) {
        return false;
      }
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          suggestion.tags.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }, [suggestions, filters]);

  // Setup virtual scrolling for performance
  const virtualizer = useVirtualizer({
    count: filteredSuggestions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Dynamic sizing based on content - expanded cards need more space
      const suggestion = filteredSuggestions[index];
      if (!suggestion) return 200;

      // Base height for collapsed state
      let height = 200;

      // Add more height if the card has tags
      if (suggestion.tags && suggestion.tags.length > 0) {
        height += 40;
      }

      // Add more height for pending status (has action buttons)
      if (suggestion.status === 'pending') {
        height += 50;
      }

      // Add extra height for longer rationale
      if (suggestion.rationale && suggestion.rationale.length > 150) {
        height += 60;
      }

      return height;
    },
    overscan: 3,
    gap: 16, // Add gap between items
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-lg font-semibold mb-2">No Issues Found!</h3>
        <p className="text-muted-foreground">
          Your code looks great! No suggestions at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Filter chips */}
      <div className="p-4 border-b">
        <FilterChips suggestions={suggestions} />
      </div>

      {/* Suggestion count */}
      <div className="px-4 py-2 text-sm text-muted-foreground border-b">
        Showing {filteredSuggestions.length} of {suggestions.length} suggestions
      </div>

      {/* Virtual scrolling container */}
      <div 
        ref={parentRef}
        className="flex-1 overflow-auto p-4"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const suggestion = filteredSuggestions[virtualItem.index];
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <SuggestionCard
                  suggestion={suggestion}
                  onViewDiff={() => onViewDiff?.(suggestion)}
                  isHighlighted={suggestion.id === highlightedSuggestionId}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="p-4 border-t bg-muted/50">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Critical</div>
            <div className="text-sm font-semibold text-destructive">
              {suggestions.filter(s => s.severity === 'critical').length}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Major</div>
            <div className="text-sm font-semibold text-orange-600">
              {suggestions.filter(s => s.severity === 'major').length}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Minor</div>
            <div className="text-sm font-semibold text-yellow-600">
              {suggestions.filter(s => s.severity === 'minor').length}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Info</div>
            <div className="text-sm font-semibold text-blue-600">
              {suggestions.filter(s => s.severity === 'info').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}