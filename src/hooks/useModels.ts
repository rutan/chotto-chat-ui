import { useQuery } from '@tanstack/react-query';
import { fetchListModels } from '../libs';
import { useAppSettings } from './useAppSettings';

export function useModels() {
  const [appSettings] = useAppSettings();

  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      return fetchListModels({
        url: appSettings.apiEndpoint,
      });
    },
  });
}
