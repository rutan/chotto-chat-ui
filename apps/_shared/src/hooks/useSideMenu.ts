import { useContext } from 'react';
import { SideMenuContext } from '../contexts';

export function useSideMenu() {
  const [isShowSideMenu, setIsShowSideMenu] = useContext(SideMenuContext);
  if (isShowSideMenu === null) throw new Error('SideMenuContext not found');

  return [isShowSideMenu, setIsShowSideMenu] as const;
}
