import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chat } from '../entities';
import { cx } from '../libs';

export interface ChatListProps {
  className?: string;
  currentChat?: Chat | null;
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
  disabled?: boolean;
}

export const ChatList = ({ className, currentChat, chats, onSelectChat, disabled }: ChatListProps) => {
  const { t } = useTranslation();

  const sections = useMemo(() => {
    const currentDateTime = new Date().getTime();

    return chats.reduce<Record<string, Chat[]>>((acc, chat) => {
      const time = Math.max(currentDateTime - chat.updatedAt.getTime(), 0);

      // today
      if (time < 24 * 60 * 60 * 1000) {
        if (!acc.today) acc.today = [];
        acc.today.push(chat);
      }
      // 7 days
      else if (time < 7 * 24 * 60 * 60 * 1000) {
        if (!acc.thisWeek) acc.thisWeek = [];
        acc.thisWeek.push(chat);
      }
      // 30 days
      else if (time < 30 * 24 * 60 * 60 * 1000) {
        if (!acc.thisMonth) acc.thisMonth = [];
        acc.thisMonth.push(chat);
      }
      // 365 days
      else if (time < 365 * 24 * 60 * 60 * 1000) {
        if (!acc.thisYear) acc.thisYear = [];
        acc.thisYear.push(chat);
      }
      // older
      else {
        if (!acc.older) acc.older = [];
        acc.older.push(chat);
      }

      return acc;
    }, {});
  }, [chats]);

  return (
    <div className={cx('ChatList', className)}>
      {Object.keys(sections).map((key) => (
        <div key={key} className="mb-4">
          <div className="text-sm bg-surface-container text-primary font-bold px-4 py-2 sticky top-0">
            {t(`ChatList.label.${key}`)}
          </div>
          {sections[key].map((chat) => (
            <ChatButton
              key={chat.id}
              type="button"
              selected={chat.id === currentChat?.id}
              onClick={() => onSelectChat(chat)}
              disabled={disabled}
            >
              <span className="truncate">{chat.title || chat.createdAt.toISOString()}</span>
            </ChatButton>
          ))}
        </div>
      ))}
    </div>
  );
};

const ChatButton = ({
  className,
  selected,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) => (
  <button
    className={cx(
      'flex items-center gap-2 w-full rounded px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed',
      selected ? 'bg-surface-dim font-bold' : 'bg-transparent disabled:bg-transparent hover:bg-surface-dim',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
