import { useContext } from 'react';
import { GlobalConfigContext } from '../contexts';

export const useGlobalConfig = () => {
  return useContext(GlobalConfigContext);
};
