import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Review, Suggestion, SuggestionStatus, FilterState, ReviewStyle, ReviewStatus } from '@/types/review.types';

interface ReviewStore {
  // State
  currentReview: Review | null;
  appliedSuggestions: Set<string>;
  rejectedSuggestions: Set<string>;
  highlightedSuggestionId: string | null;
  filters: FilterState;
  isProcessing: boolean;
  
  // Actions
  setReview: (review: Review) => void;
  updateReviewStatus: (status: ReviewStatus) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  updateSuggestion: (id: string, updates: Partial<Suggestion>) => void;
  applySuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  revertSuggestion: (id: string) => void;
  highlightSuggestion: (id: string | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  updateCode: (code: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  reset: () => void;
}

const initialFilters: FilterState = {
  severity: [],
  tags: [],
  status: []
};

export const useReviewStore = create<ReviewStore>()(
  devtools(
    (set) => ({
      // Initial state
      currentReview: null,
      appliedSuggestions: new Set(),
      rejectedSuggestions: new Set(),
      highlightedSuggestionId: null,
      filters: initialFilters,
      isProcessing: false,

      // Actions
      setReview: (review) => 
        set({ 
          currentReview: review,
          appliedSuggestions: new Set(),
          rejectedSuggestions: new Set(),
          highlightedSuggestionId: null
        }),

      updateReviewStatus: (status) =>
        set((state) => ({
          currentReview: state.currentReview 
            ? { ...state.currentReview, status }
            : null
        })),

      addSuggestion: (suggestion) =>
        set((state) => ({
          currentReview: state.currentReview
            ? {
                ...state.currentReview,
                suggestions: [...state.currentReview.suggestions, suggestion]
              }
            : null
        })),

      updateSuggestion: (id, updates) =>
        set((state) => ({
          currentReview: state.currentReview
            ? {
                ...state.currentReview,
                suggestions: state.currentReview.suggestions.map(s =>
                  s.id === id ? { ...s, ...updates } : s
                )
              }
            : null
        })),

      applySuggestion: (id) =>
        set((state) => {
          const newApplied = new Set(state.appliedSuggestions);
          const newRejected = new Set(state.rejectedSuggestions);
          newApplied.add(id);
          newRejected.delete(id);

          return {
            appliedSuggestions: newApplied,
            rejectedSuggestions: newRejected,
            currentReview: state.currentReview
              ? {
                  ...state.currentReview,
                  suggestions: state.currentReview.suggestions.map(s =>
                    s.id === id 
                      ? { ...s, status: 'accepted' as SuggestionStatus, appliedAt: new Date() }
                      : s
                  )
                }
              : null
          };
        }),

      rejectSuggestion: (id) =>
        set((state) => {
          const newApplied = new Set(state.appliedSuggestions);
          const newRejected = new Set(state.rejectedSuggestions);
          newApplied.delete(id);
          newRejected.add(id);

          return {
            appliedSuggestions: newApplied,
            rejectedSuggestions: newRejected,
            currentReview: state.currentReview
              ? {
                  ...state.currentReview,
                  suggestions: state.currentReview.suggestions.map(s =>
                    s.id === id 
                      ? { ...s, status: 'rejected' as SuggestionStatus }
                      : s
                  )
                }
              : null
          };
        }),

      revertSuggestion: (id) =>
        set((state) => {
          const newApplied = new Set(state.appliedSuggestions);
          const newRejected = new Set(state.rejectedSuggestions);
          newApplied.delete(id);
          newRejected.delete(id);

          return {
            appliedSuggestions: newApplied,
            rejectedSuggestions: newRejected,
            currentReview: state.currentReview
              ? {
                  ...state.currentReview,
                  suggestions: state.currentReview.suggestions.map(s =>
                    s.id === id 
                      ? { ...s, status: 'pending' as SuggestionStatus, appliedAt: undefined }
                      : s
                  )
                }
              : null
          };
        }),

      highlightSuggestion: (id) =>
        set({ highlightedSuggestionId: id }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters }
        })),

      clearFilters: () =>
        set({ filters: initialFilters }),

      updateCode: (code) =>
        set((state) => ({
          currentReview: state.currentReview
            ? { ...state.currentReview, code }
            : null
        })),

      setProcessing: (isProcessing) =>
        set({ isProcessing }),

      reset: () =>
        set({
          currentReview: null,
          appliedSuggestions: new Set(),
          rejectedSuggestions: new Set(),
          highlightedSuggestionId: null,
          filters: initialFilters,
          isProcessing: false
        })
    }),
    {
      name: 'review-store'
    }
  )
);