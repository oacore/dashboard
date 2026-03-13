import useSWR from 'swr';
import { postRequestFetcher, swrDefaultConfig } from '@config/swr';
import { useValidatorStore } from '../store/validatorStore';

export const useValidation = (id: string | null, shouldValidate: boolean = false) => {
  const { recordValue } = useValidatorStore();

  const key = shouldValidate && id && recordValue
    ? `/${id}/rioxx/validate`
    : null;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    key ? () => postRequestFetcher(key, { record: recordValue }) : null,
    swrDefaultConfig,
  );

  return {
    validationResult: data || {},
    error,
    isValidating: isLoading,
    mutate,
    isError: !!error,
  };
};
