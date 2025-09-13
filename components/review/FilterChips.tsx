'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useReviewStore } from '@/lib/store/reviewStore';
import type { Suggestion, SeverityLevel, SuggestionStatus } from '@/types/review.types';
import { cn } from '@/lib/utils';

interface FilterChipsProps {
  suggestions: Suggestion[];
}

export default function FilterChips({ suggestions }: FilterChipsProps) {
  const { filters, setFilters, clearFilters } = useReviewStore();

  // Get unique values for filters
  const availableSeverities = Array.from(new Set(suggestions.map(s => s.severity)));
  const availableStatuses = Array.from(new Set(suggestions.map(s => s.status)));
  const availableTags = Array.from(new Set(suggestions.flatMap(s => s.tags)));

  const toggleSeverity = (severity: SeverityLevel) => {
    const current = filters.severity;
    if (current.includes(severity)) {
      setFilters({ severity: current.filter(s => s !== severity) });
    } else {
      setFilters({ severity: [...current, severity] });
    }
  };

  const toggleStatus = (status: SuggestionStatus) => {
    const current = filters.status;
    if (current.includes(status)) {
      setFilters({ status: current.filter(s => s !== status) });
    } else {
      setFilters({ status: [...current, status] });
    }
  };

  const toggleTag = (tag: string) => {
    const current = filters.tags;
    if (current.includes(tag)) {
      setFilters({ tags: current.filter(t => t !== tag) });
    } else {
      setFilters({ tags: [...current, tag] });
    }
  };

  const hasActiveFilters = 
    filters.severity.length > 0 || 
    filters.status.length > 0 || 
    filters.tags.length > 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800';
      case 'major':
        return 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800';
      case 'minor':
        return 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800';
      case 'info':
        return 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Severity filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Severity:</span>
        {availableSeverities.map(severity => (
          <Badge
            key={severity}
            variant={filters.severity.includes(severity) ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-colors',
              filters.severity.includes(severity) && getSeverityColor(severity)
            )}
            onClick={() => toggleSeverity(severity)}
          >
            {severity}
          </Badge>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center">Status:</span>
        {availableStatuses.map(status => (
          <Badge
            key={status}
            variant={filters.status.includes(status) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleStatus(status)}
          >
            {status}
          </Badge>
        ))}
      </div>

      {/* Tag filters */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Tags:</span>
          {availableTags.slice(0, 10).map(tag => (
            <Badge
              key={tag}
              variant={filters.tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {availableTags.length > 10 && (
            <span className="text-xs text-muted-foreground self-center">
              +{availableTags.length - 10} more
            </span>
          )}
        </div>
      )}

      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-7 text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}