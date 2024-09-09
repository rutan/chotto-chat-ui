import { useCallback, useState } from 'react';
import { ChatBalloonList, ChatForm, Header, SideMenu } from './components';
import {
  type MessageHistory,
  useAppSettings,
  useChatGenerator,
  useDarkMode,
  useLocale,
  useMessageHistories,
  useModels,
  useSideMenu,
} from './hooks';
import { type Model, cx } from './libs';

export const App: React.FC = () => {
  const [appSettings] = useAppSettings();
  useDarkMode(appSettings);
  useLocale(appSettings);

  const [isShowSideMenu, setIsShowSideMenu] = useSideMenu();

  const { models } = useModels();
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const {
    currentHistories,
    addNewMessageHistory,
    addBranchMessageHistory,
    changeBranchMessageHistory,
    resetHistories,
  } = useMessageHistories();
  const {
    loading: chatLoading,
    generatingMessage,
    abort: cancelChat,
  } = useChatGenerator({
    model: currentModel?.name ?? '',
    messageHistories: currentHistories,
    addMessageHistory: addNewMessageHistory,
  });

  const handleSendMessage = useCallback(
    (message: string) => {
      const userMessage = { role: 'user', content: message } as const;
      addNewMessageHistory(userMessage);
    },
    [addNewMessageHistory],
  );

  const handleSendNewBranch = useCallback(
    (history: MessageHistory, message: string) => {
      const userMessage = { role: 'user', content: message } as const;
      addBranchMessageHistory(history, userMessage);
    },
    [addBranchMessageHistory],
  );

  const handleNewChat = useCallback(() => {
    resetHistories(); // wip
  }, [resetHistories]);

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
        <SideMenu onNewChat={handleNewChat} disabled={chatLoading} />
      </div>
      <div
        className={cx(
          'flex flex-col h-full flex-1 transition-padding duration-200',
          isShowSideMenu ? 'md:pl-64' : 'md:pl-0',
        )}
      >
        <Header
          className="shrink-0"
          selectedModel={currentModel}
          models={models}
          onChangeModel={setCurrentModel}
          onRemoveHistory={resetHistories}
          onToggleSideMenu={handleToggleSideMenu}
          disabled={chatLoading}
        />
        <ChatBalloonList
          currentHistories={currentHistories}
          generatingMessage={generatingMessage}
          handleSendNewBranch={handleSendNewBranch}
          changeBranchMessageHistory={changeBranchMessageHistory}
          disabled={chatLoading}
        />
        {currentModel && (
          <div className="w-full bg-surface p-2 shrink-0">
            <div className="max-w-3xl px-2 mx-auto">
              <ChatForm onSend={handleSendMessage} isChatting={chatLoading} onCancelChat={cancelChat} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
