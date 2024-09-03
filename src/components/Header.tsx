import { useCallback, useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { type Model, cx } from '../libs';
import { HeaderMenu } from './HeaderMenu';
import { ModelSelector } from './ModelSelector';
import { SettingDialog } from './SettingDialog';

export interface HeaderProps {
  className?: string;
  selectedModel: Model | null;
  models: Model[];
  onChangeModel: (model: Model | null) => void;
  systemPrompt: string;
  onChangeSystemPrompt: (newSystemPrompt: string) => void;
  onRemoveHistory: () => void;
  disabled: boolean;
}

export const Header = ({
  className,
  selectedModel,
  models,
  onChangeModel,
  systemPrompt,
  onChangeSystemPrompt,
  onRemoveHistory,
  disabled,
}: HeaderProps) => {
  const [isShowSettingDialog, setIsShowSettingDialog] = useState(false);

  const handleOpenSettingModal = useCallback(() => {
    setIsShowSettingDialog(true);
  }, []);

  const handleCloseSettingDialog = useCallback(() => {
    setIsShowSettingDialog(false);
  }, []);

  return (
    <>
      <div className={cx('Header', 'fixed left-0 top-0 w-full h-12 bg-surface-container shadow-md', className)}>
        <div className="max-w-3xl h-full mx-auto grid grid-cols-[1fr_auto_1fr] items-center justify-between">
          <div className="flex justify-start gap-1">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 text-on-surface rounded hover:bg-surface-dim"
              onClick={handleOpenSettingModal}
              disabled={disabled}
            >
              <MdSettings className="w-6 h-6" title="Settings" />
            </button>
          </div>
          <div className="flex justify-center h-full p-2 box-border">
            <ModelSelector selectedModel={selectedModel} models={models} onChange={onChangeModel} disabled={disabled} />
          </div>
          <div className="flex justify-end gap-1">
            <HeaderMenu disabled={disabled} onClickRemoveHistory={onRemoveHistory} />
          </div>
        </div>
      </div>
      <SettingDialog
        isOpen={isShowSettingDialog}
        systemPrompt={systemPrompt}
        onChangeSystemPrompt={onChangeSystemPrompt}
        onClose={handleCloseSettingDialog}
      />
    </>
  );
};
