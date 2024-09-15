import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete, MdMoreVert, MdSettings } from 'react-icons/md';
import type { Chat } from '../entities';
import { cx } from '../libs';
import { ChatSettingDialog } from './ChatSettingDialog';

export interface HeaderMenuProps {
  chat: Chat;
  disabled: boolean;
  onUpdateChat: (chat: Chat) => void;
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

export const HeaderMenu = ({ chat, disabled, onUpdateChat, onClickRemoveChat }: HeaderMenuProps) => {
  const { t } = useTranslation();
  const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false);

  const handleOpenSettingDialog = useCallback(() => {
    setIsOpenSettingDialog(true);
  }, []);

  const handleCloseSettingDialog = useCallback(() => {
    setIsOpenSettingDialog(false);
  }, []);

  return (
    <>
      <Menu>
        <MenuButton className="flex items-center justify-center w-10 h-10 text-on-surface rounded hover:bg-surface-dim">
          <MdMoreVert title="menu" className="w-6 h-6" />
        </MenuButton>
        <MenuItems anchor="bottom end" className="z-50 bg-surface p-1 rounded shadow-md">
          <MenuItem>
            <MenuLink className="text-on-surface" disabled={disabled} onClick={handleOpenSettingDialog}>
              <MdSettings />
              {t('HeaderMenu.settingChat')}
            </MenuLink>
          </MenuItem>
          <MenuSeparator className="my-2 h-px bg-surface-dim" />
          <MenuItem>
            <MenuLink className="text-error" disabled={disabled} onClick={onClickRemoveChat}>
              <MdDelete />
              {t('HeaderMenu.removeChat')}
            </MenuLink>
          </MenuItem>
        </MenuItems>
      </Menu>
      <ChatSettingDialog
        chat={chat}
        onUpdateChat={onUpdateChat}
        isOpen={isOpenSettingDialog}
        onClose={handleCloseSettingDialog}
      />
    </>
  );
};
