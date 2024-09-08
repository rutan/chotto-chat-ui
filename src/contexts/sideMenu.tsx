import { type ReactNode, createContext, useEffect, useState } from 'react';

type RealSetIsShowSideMenu = (isShowSideMenu: boolean | ((prev: boolean) => boolean)) => void;

export const SideMenuContext = createContext<[boolean | null, RealSetIsShowSideMenu]>([null, () => {}]);

export const SideMenuProvider = ({ children }: { children?: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isShowSideMenu, setIsShowSideMenu] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsShowSideMenu(true);
    } else {
      setIsShowSideMenu(false);
    }
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return <SideMenuContext.Provider value={[isShowSideMenu, setIsShowSideMenu]}>{children}</SideMenuContext.Provider>;
};
