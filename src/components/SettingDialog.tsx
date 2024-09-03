import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Select } from '@headlessui/react';
import { useCallback } from 'react';
import { useDarkMode } from '../hooks';
import { cx } from '../libs';

export interface SettingDialogProps {
  isOpen: boolean;
  systemPrompt: string;
  onChangeSystemPrompt: (newSystemPrompt: string) => void;
  onClose: () => void;
}

const SettingSection = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <section className={cx('mb-4', className)}>{children}</section>
);

export const SettingDialog = ({ isOpen, systemPrompt, onChangeSystemPrompt, onClose }: SettingDialogProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleChangeDarkMode = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if ((isDarkMode && e.currentTarget.value === 'light') || (!isDarkMode && e.currentTarget.value === 'dark')) {
        toggleDarkMode();
      }
    },
    [isDarkMode, toggleDarkMode],
  );

  const handleChangeSystemPrompt = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeSystemPrompt(e.target.value);
    },
    [onChangeSystemPrompt],
  );

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-surface text-on-surface p-8 rounded">
            <SettingSection>
              <DialogTitle className="text-xl font-bold">Color Theme</DialogTitle>
              <Select
                className="w-full p-2 bg-surface-container text-on-surface my-4"
                value={isDarkMode ? 'dark' : 'light'}
                onChange={handleChangeDarkMode}
              >
                <option value="light">Light mode</option>
                <option value="dark">Dark mode</option>
              </Select>
            </SettingSection>

            <SettingSection>
              <DialogTitle className="text-xl font-bold">System Prompt</DialogTitle>
              <textarea
                className="w-full h-32 p-4 bg-surface-container text-on-surface resize-none my-4"
                value={systemPrompt}
                onChange={handleChangeSystemPrompt}
                placeholder="You are assistant bot."
              />
            </SettingSection>

            <div className="flex justify-center gap-4">
              <button type="button" className="min-h-12 px-8 bg-primary text-on-primary rounded" onClick={onClose}>
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
