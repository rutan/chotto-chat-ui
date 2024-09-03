import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Select } from '@headlessui/react';
import { useCallback, useState } from 'react';
import { useAppSettings } from '../hooks';
import { cx } from '../libs';

export interface SettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingSection = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <section className={cx('mb-4', className)}>{children}</section>
);

export const SettingDialog = ({ isOpen, onClose }: SettingDialogProps) => {
  const [appSettings, setAppSettings] = useAppSettings();
  const [tmpApiEndpoint, setTmpApiEndpoint] = useState(appSettings.apiEndpoint);

  const handleChangeApiEndpoint = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpApiEndpoint(e.target.value);
  }, []);

  const handleChangeDarkMode = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newColorTheme = e.target.value as 'system' | 'light' | 'dark';
      setAppSettings((prev) => ({ ...prev, colorTheme: newColorTheme }));
    },
    [setAppSettings],
  );

  const handleChangeDefaultSystemPrompt = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAppSettings((prev) => ({ ...prev, defaultSystemPrompt: e.target.value }));
    },
    [setAppSettings],
  );

  const handleClose = useCallback(() => {
    setAppSettings((prev) => ({ ...prev, apiEndpoint: tmpApiEndpoint }));
    onClose();
  }, [onClose, setAppSettings, tmpApiEndpoint]);

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-surface text-on-surface p-8 rounded">
            <SettingSection>
              <DialogTitle className="text-xl font-bold">API Endpoint</DialogTitle>
              <input
                type="text"
                className="w-full p-2 bg-surface-container text-on-surface my-4"
                value={tmpApiEndpoint}
                onChange={handleChangeApiEndpoint}
              />
            </SettingSection>

            <SettingSection>
              <DialogTitle className="text-xl font-bold">Color Theme</DialogTitle>
              <Select
                className="w-full p-2 bg-surface-container text-on-surface my-4"
                value={appSettings.colorTheme}
                onChange={handleChangeDarkMode}
              >
                <option value="system">System</option>
                <option value="light">Light mode</option>
                <option value="dark">Dark mode</option>
              </Select>
            </SettingSection>

            <SettingSection>
              <DialogTitle className="text-xl font-bold">Default System Prompt</DialogTitle>
              <textarea
                className="w-full h-32 p-4 bg-surface-container text-on-surface resize-none my-4"
                value={appSettings.defaultSystemPrompt}
                onChange={handleChangeDefaultSystemPrompt}
                placeholder="You are assistant bot."
              />
            </SettingSection>

            <div className="flex justify-center gap-4">
              <button type="button" className="min-h-12 px-8 bg-primary text-on-primary rounded" onClick={handleClose}>
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
