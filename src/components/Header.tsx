import React, { useCallback, useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { cx, Model } from '../libs';
import { ModelSelector } from './ModelSelector';
import { DarkModeButton } from './DarkModeButton';
import { SystemPromptDialog } from './SystemPromptDialog';

export interface HeaderProps {
  className?: string;
  models: Model[];
  onChangeModel: (model: Model | null) => void;
  systemPrompt: string;
  onChangeSystemPrompt: (newSystemPrompt: string) => void;
  disabled: boolean;
}

export const Header = ({
  className,
  models,
  onChangeModel,
  systemPrompt,
  onChangeSystemPrompt,
  disabled,
}: HeaderProps) => {
  const [isShowSystemPrompt, setIsShowSystemPrompt] = useState(false);

  const handleOpenPrompt = useCallback(() => {
    setIsShowSystemPrompt(true);
  }, []);

  const handleSubmitPrompt = useCallback((newSystemPrompt: string) => {
    onChangeSystemPrompt(newSystemPrompt);
    setIsShowSystemPrompt(false);
  }, []);

  const handleCancelPrompt = useCallback(() => {
    setIsShowSystemPrompt(false);
  }, []);

  return (
    <>
      <div className={cx('Header', 'fixed left-0 top-0 w-full h-12 bg-surface-container shadow-md', className)}>
        <div className="max-w-3xl h-full mx-auto flex items-center justify-between overflow-x-auto">
          <div className="flex gap-2">
            <ModelSelector className="max-w-64" models={models} onChange={onChangeModel} disabled={disabled} />
          </div>
          <div className="flex gap-2">
            <button
              className="flex items-center justify-center w-10 h-10 bg-secondary text-on-primary rounded hover:opacity-80"
              onClick={handleOpenPrompt}
              disabled={disabled}
            >
              <MdSettings className="w-6 h-6" title="Settings" />
            </button>
            <DarkModeButton
              className="flex items-center justify-center w-10 h-10 bg-tertiary text-on-primary rounded hover:opacity-80"
              iconClassName="w-6 h-6"
            />
          </div>
        </div>
      </div>
      <SystemPromptDialog
        isOpen={isShowSystemPrompt}
        systemPrompt={systemPrompt}
        onSubmit={handleSubmitPrompt}
        onCancel={handleCancelPrompt}
      />
    </>
  );
};
