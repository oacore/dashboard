import { useState, useEffect } from 'react';

interface RorSuggestion {
  id: string;
  name: string;
  names?: Array<{
    value: string;
    types?: string[];
  }>;
  [key: string]: unknown;
}

interface RorApiResponse {
  items: RorSuggestion[];
  [key: string]: unknown;
}

interface UseRorSuggestionsOptions {
  value: string;
  isOpen: boolean;
  initialValue?: string;
  skipInitialFetch?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface UseRorSuggestionsReturn {
  suggestions: RorSuggestion[];
  isInitialLoad: boolean;
  setIsInitialLoad: (value: boolean) => void;
}

const ROR_API_URL = 'https://api.ror.org/organizations';

export const useRorSuggestions = ({
  value,
  isOpen,
  initialValue,
  skipInitialFetch = false,
  onOpenChange,
}: UseRorSuggestionsOptions): UseRorSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<RorSuggestion[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!value || value.length === 0) {
      setSuggestions([]);
      if (onOpenChange && isOpen) {
        onOpenChange(false);
      }
      return;
    }

    // Skip fetching on initial load if value matches initial value
    if (skipInitialFetch && isInitialLoad && value === initialValue) {
      setIsInitialLoad(false);
      return;
    }

    setIsInitialLoad(false);

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${ROR_API_URL}?query=${encodeURIComponent(value)}`);
        const data: RorApiResponse = await response.json();
        const items = data.items || [];
        setSuggestions(items);

        // Keep dropdown open if it was opened by user typing and has results
        if (isOpen && items.length > 0 && onOpenChange) {
          onOpenChange(true);
        }
      } catch (error) {
        console.error('Error fetching ROR suggestions:', error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [value, initialValue, isInitialLoad, skipInitialFetch, isOpen, onOpenChange]);

  return {
    suggestions,
    isInitialLoad,
    setIsInitialLoad,
  };
};
