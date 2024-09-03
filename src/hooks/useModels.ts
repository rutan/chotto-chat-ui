import { useEffect, useState } from 'react';
import { type ApiConfig, type Model, fetchListModels } from '../libs';

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
