import { useCallback, useState } from 'react';
import { ChatPanel, SideMenu } from './components';
import { type Chat, initChat } from './entities';
import { useAppSettings, useDarkMode, useLocale, useSideMenu } from './hooks';
import { cx } from './libs';

export const App: React.FC = () => {
  const [appSettings] = useAppSettings();
  useDarkMode(appSettings);
  useLocale(appSettings);
  const [isShowSideMenu, setIsShowSideMenu] = useSideMenu();
  const [chat, setChat] = useState<Chat | null>(null);

  const handleOpenNewChat = useCallback(() => {
    const chat = initChat();
    setChat(chat);
  }, []);

  const handleSetChat = useCallback((chat: Chat | null) => {
    setChat(chat);
  }, []);

  const handleToggleSideMenu = useCallback(() => {
    setIsShowSideMenu(!isShowSideMenu);
  }, [isShowSideMenu, setIsShowSideMenu]);

  const handleCloseSideMenu = useCallback(() => {
    setIsShowSideMenu(false);
  }, [setIsShowSideMenu]);

  return (
    <div className="flex w-full h-full">
      {isShowSideMenu && (
        <button
          type="button"
          className="fixed inset-0 bg-black z-40 bg-opacity-50 block md:hidden"
          onClick={handleCloseSideMenu}
          title="Close side menu"
        />
      )}
      <div
        className={cx(
          'fixed top-0 left-0 w-64 h-full z-40 transition-transform duration-200',
          isShowSideMenu ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SideMenu onNewChat={handleOpenNewChat} chat={chat} onSelectChat={handleSetChat} />
      </div>
      {chat ? (
        <ChatPanel
          key={chat.id}
          className={cx(
            'flex flex-col h-full flex-1 transition-padding duration-200',
            isShowSideMenu ? 'md:pl-64' : 'md:pl-0',
          )}
          chat={chat}
          onChangeChat={handleSetChat}
          onClickToggleSideMenu={handleToggleSideMenu}
        />
      ) : null}
    </div>
  );
};
