import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete, MdMoreVert } from 'react-icons/md';
import { cx } from '../libs';

export interface HeaderMenuProps {
  disabled: boolean;
  onClickRemoveChat: () => void;
}

const MenuLink = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cx('flex w-full items-center gap-2 px-3 py-2 hover:bg-surface-dim', className)}
      {...props}
    >
      {children}
    </button>
  ),
);

export const HeaderMenu = ({ disabled, onClickRemoveChat }: HeaderMenuProps) => {
  const { t } = useTranslation();

  return (
    <Menu>
      <MenuButton className="flex items-center justify-center w-10 h-10 text-on-surface rounded hover:bg-surface-dim">
        <MdMoreVert title="menu" className="w-6 h-6" />
      </MenuButton>
      <MenuItems anchor="bottom end" className="z-50 bg-surface p-1 rounded shadow-md">
        <MenuItem>
          <MenuLink className="text-error" disabled={disabled} onClick={onClickRemoveChat}>
            <MdDelete />
            {t('HeaderMenu.removeChat')}
          </MenuLink>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
