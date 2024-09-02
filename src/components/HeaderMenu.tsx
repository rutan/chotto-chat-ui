import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdMoreVert, MdDelete } from 'react-icons/md';
import { cx } from '../libs';

export interface HeaderMenuProps {
  disabled: boolean;
  onClickRemoveHistory: () => void;
}

const MenuLink = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
}) => {
  return (
    <button className={cx('flex w-full items-center gap-2 px-3 py-2 hover:bg-surface-dim', className)} {...props}>
      {children}
    </button>
  );
};

export const HeaderMenu = ({ disabled, onClickRemoveHistory }: HeaderMenuProps) => {
  return (
    <Menu>
      <MenuButton className="flex items-center justify-center w-10 h-10 text-on-surface rounded hover:bg-surface-dim">
        <MdMoreVert title="menu" className="w-6 h-6" />
      </MenuButton>
      <MenuItems anchor="bottom end" className="bg-surface p-1 rounded shadow-md">
        <MenuItem>
          <MenuLink className="text-error" disabled={disabled} onClick={onClickRemoveHistory}>
            <MdDelete />
            Remove History
          </MenuLink>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
