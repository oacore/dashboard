import useSWR from 'swr';
import { getBadges, type BadgesData } from '../api/getBadges';

const BADGES_SWR_KEY = 'badges';

export const useBadgesData = () => {
  const { data, error, isLoading } = useSWR<BadgesData>(
    BADGES_SWR_KEY,
    () => getBadges()
  );

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'Failed to load badges') : null,
  };
};
