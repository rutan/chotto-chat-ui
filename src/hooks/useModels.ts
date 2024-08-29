import { useEffect, useState } from 'react';
import { ApiConfig, fetchListModels, Model } from '../libs';

export function useModels(config: ApiConfig) {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    fetchListModels(config).then((data) => {
      setModels(data);
    });
  }, [config]);

  return {
    models,
  };
}
