import { useEffect, useState } from 'react';
import { type Model, fetchListModels } from '../libs';
import { useAppSettings } from './useAppSettings';

export function useModels() {
  const [appSettings] = useAppSettings();
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    fetchListModels({
      url: appSettings.apiEndpoint,
    }).then((data) => {
      setModels(data);
    });
  }, [appSettings.apiEndpoint]);

  return {
    models,
  };
}
