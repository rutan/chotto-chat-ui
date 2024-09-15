import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

export interface BaseSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const BaseSettingDialog = ({ isOpen, onClose, children }: BaseSettingDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg bg-surface text-on-surface p-8 rounded">
          {children}

          <div className="flex justify-center gap-4">
            <button type="button" className="min-h-12 px-8 bg-primary text-on-primary rounded" onClick={onClose}>
              {t('BaseSettingDialog.close')}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
