import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdSettings } from 'react-icons/md';
import { cx } from '../libs';
import { SettingDialog } from './SettingDialog';

export type SideMenuProps = {
  className?: string;
  onNewChat: () => void;
  disabled?: boolean;
};

export const SideMenu = ({ className, onNewChat, disabled }: SideMenuProps) => {
  const { t } = useTranslation();
  const [isShowSettingDialog, setIsShowSettingDialog] = useState(false);

  const handleOpenSettingModal = useCallback(() => {
    setIsShowSettingDialog(true);
  }, []);

  const handleCloseSettingDialog = useCallback(() => {
    setIsShowSettingDialog(false);
  }, []);

  return (
    <>
      <div className={cx('flex flex-col w-full h-full bg-surface-container border-r border-surface-dim', className)}>
        <div className="p-2">
          <ToolButton type="button" onClick={onNewChat} disabled={disabled}>
            <MdAdd className="w-6 h-6" />
            {t('SideMenu.newChat')}
          </ToolButton>
        </div>
        <div className="flex-1">{/* TODO: histories */}</div>
        <div className="p-2">
          <ToolButton type="button" onClick={handleOpenSettingModal} disabled={disabled}>
            <MdSettings className="w-6 h-6" />
            {t('SideMenu.settings')}
          </ToolButton>
        </div>
      </div>
      <SettingDialog isOpen={isShowSettingDialog} onClose={handleCloseSettingDialog} />
    </>
  );
};

const ToolButton = ({ className, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cx(
      'flex items-center gap-2 w-full rounded p-4 bg-transparent hover:bg-surface-dim disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent',
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);
