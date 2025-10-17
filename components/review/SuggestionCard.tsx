'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  X, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Suggestion } from '@/types/review.types';
import { useReviewStore } from '@/lib/store/reviewStore';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onViewDiff?: () => void;
  isHighlighted?: boolean;
}

export default function SuggestionCard({ 
  suggestion, 
  onViewDiff,
  isHighlighted 
}: SuggestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { applySuggestion, rejectSuggestion, highlightSuggestion } = useReviewStore();
  
  const getSeverityIcon = () => {
    switch (suggestion.severity) {
      case 'critical':
        return <Bug className="h-4 w-4" />;
      case 'major':
        return <AlertTriangle className="h-4 w-4" />;
      case 'minor':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityColor = () => {
    switch (suggestion.severity) {
      case 'critical':
        return 'destructive';
      case 'major':
        return 'warning';
      case 'minor':
        return 'secondary';
      case 'info':
        return 'default';
    }
  };

  const getStatusColor = () => {
    switch (suggestion.status) {
      case 'accepted':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      default:
        return '';
    }
  };

  const handleAccept = () => {
    applySuggestion(suggestion.id);
  };

  const handleReject = () => {
    rejectSuggestion(suggestion.id);
  };

  const handleCardClick = () => {
    highlightSuggestion(suggestion.id);
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 cursor-pointer hover:shadow-md',
        isHighlighted && 'ring-2 ring-primary',
        getStatusColor()
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={getSeverityColor() as any} className="gap-1">
                {getSeverityIcon()}
                {suggestion.severity}
              </Badge>
              {suggestion.confidence && (
                <Badge variant="outline" className="text-xs">
                  {suggestion.confidence}% confidence
                </Badge>
              )}
              {suggestion.status !== 'pending' && (
                <Badge 
                  variant={suggestion.status === 'accepted' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {suggestion.status}
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-semibold leading-tight">
              {suggestion.title}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Line {suggestion.range.start}</span>
              {suggestion.range.start !== suggestion.range.end && (
                <span>- {suggestion.range.end}</span>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <CardDescription className="text-sm">
            {suggestion.rationale}
          </CardDescription>

          {suggestion.tags && suggestion.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {suggestion.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {suggestion.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept();
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject();
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
              {suggestion.fix && onViewDiff && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDiff();
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Diff
                </Button>
              )}
            </div>
          )}
        </CardContent>
      )}
      {!isExpanded && (
        <CardContent className="pt-0">
          <CardDescription className="text-sm line-clamp-2">
            {suggestion.rationale}
          </CardDescription>
        </CardContent>
      )}
    </Card>
  );
}