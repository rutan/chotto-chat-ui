import { type ReactNode, createContext, useEffect, useState } from 'react';
import { isSmallViewport } from '../libs';

type RealSetIsShowSideMenu = (isShowSideMenu: boolean | ((prev: boolean) => boolean)) => void;

export const SideMenuContext = createContext<[boolean | null, RealSetIsShowSideMenu]>([null, () => {}]);

export const SideMenuProvider = ({ children }: { children?: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isShowSideMenu, setIsShowSideMenu] = useState(false);

  useEffect(() => {
    if (isSmallViewport()) {
      setIsShowSideMenu(false);
    } else {
      setIsShowSideMenu(true);
    }
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return <SideMenuContext.Provider value={[isShowSideMenu, setIsShowSideMenu]}>{children}</SideMenuContext.Provider>;
};
