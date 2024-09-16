import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdSettings } from 'react-icons/md';
import type { Chat } from '../entities';
import { useChats } from '../hooks';
import { cx } from '../libs';
import { ChatList } from './ChatList';
import { AppSettingDialog } from './settingDialogs';

export type SideMenuProps = {
  className?: string;
  chat?: Chat | null;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  disabled?: boolean;
};

export const SideMenu = ({ className, chat: currentChat, onNewChat, onSelectChat, disabled }: SideMenuProps) => {
  const { t } = useTranslation();
  const [isShowSettingDialog, setIsShowSettingDialog] = useState(false);
  const { chats } = useChats();

  const handleOpenSettingModal = useCallback(() => {
    setIsShowSettingDialog(true);
  }, []);

  const handleCloseSettingDialog = useCallback(() => {
    setIsShowSettingDialog(false);
  }, []);

  return (
    <>
      <div
        className={cx(
          'grid grid-rows-[auto,1fr,auto] w-full h-full bg-surface-container border-r border-surface-dim',
          className,
        )}
      >
        <div className="p-2">
          <ToolButton type="button" onClick={onNewChat} disabled={disabled}>
            <MdAdd className="w-6 h-6" />
            {t('SideMenu.newChat')}
          </ToolButton>
        </div>
        <ChatList
          className="overflow-auto px-2"
          chats={chats}
          currentChat={currentChat}
          onSelectChat={onSelectChat}
          disabled={disabled}
        />
        <div className="p-2">
          <ToolButton type="button" onClick={handleOpenSettingModal} disabled={disabled}>
            <MdSettings className="w-6 h-6" />
            {t('SideMenu.settings')}
          </ToolButton>
        </div>
      </div>
      <AppSettingDialog isOpen={isShowSettingDialog} onClose={handleCloseSettingDialog} />
    </>
  );
};

const ToolButton = ({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cx(
      'flex items-center gap-2 w-full rounded p-4 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent disabled:bg-transparent hover:bg-surface-dim',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
