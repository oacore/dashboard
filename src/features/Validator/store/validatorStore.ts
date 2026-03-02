import { create } from 'zustand';
import { http } from '@/config/axios';
import type { ValidationResult } from '../types';

interface ValidatorState {
  validationResult: ValidationResult;
  recordValue: string;
  isValidating: boolean;
  error: string | null;
}

interface ValidatorActions {
  setValidationResult: (result: ValidationResult) => void;
  setRecordValue: (value: string) => void;
  rioxValidation: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useValidatorStore = create<ValidatorState & ValidatorActions>()((set, get) => ({
  // State
  validationResult: {},  // Start with empty object
  recordValue: '',
  isValidating: false,
  error: null,

  // Actions
  setValidationResult: (result) => {
    set({ validationResult: result });
  },

  setRecordValue: (value) => {
    set({ recordValue: value });
  },

  rioxValidation: async (id) => {
    set({ isValidating: true, error: null });

    try {
      const response = await http.post(`internal/${id}/rioxx/validate`, {
        record: get().recordValue,
      });

      const result = response.data as ValidationResult;
      set({
        validationResult: result,
        isValidating: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Validation failed';
      set({
        isValidating: false,
        error: errorMessage
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
