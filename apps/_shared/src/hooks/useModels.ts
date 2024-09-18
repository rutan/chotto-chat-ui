import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchListModels } from '../libs';
import { useAppSettings } from './useAppSettings';

export function useModels() {
  const [appSettings] = useAppSettings();

  const { refetch, isFetched, isError, ...rest } = useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      return fetchListModels({
        url: appSettings.apiEndpoint,
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies(appSettings.apiEndpoint): refetch when change apiEndpoint
  useEffect(() => {
    refetch();
  }, [refetch, appSettings.apiEndpoint]);

  return {
    refetch,
    isFetched,
    isError,
    ...rest,
  };
}
