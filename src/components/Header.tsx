import { FiSidebar } from 'react-icons/fi';
import { type Model, cx } from '../libs';
import { HeaderMenu } from './HeaderMenu';
import { ModelSelector } from './ModelSelector';

export interface HeaderProps {
  className?: string;
  selectedModel: Model | null;
  models: Model[];
  onChangeModel: (model: Model | null) => void;
  onRemoveHistory: () => void;
  onToggleSideMenu?: () => void;
  disabled: boolean;
}

export const Header = ({
  className,
  selectedModel,
  models,
  onChangeModel,
  onRemoveHistory,
  onToggleSideMenu,
  disabled,
}: HeaderProps) => {
  return (
    <div className={cx('Header', 'relative z-30 w-full h-12 bg-surface', className)}>
      <div className="w-full h-full px-2 mx-auto grid grid-cols-[1fr_auto_1fr] items-center justify-between">
        <div className="flex justify-start gap-1">
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 text-on-surface rounded hover:bg-surface-dim"
            onClick={onToggleSideMenu}
            disabled={disabled}
          >
            <FiSidebar className="w-6 h-6" title="Settings" />
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
  );
};
