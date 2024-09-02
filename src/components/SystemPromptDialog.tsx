import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogBackdrop, DialogTitle } from '@headlessui/react';

export interface SystemPromptDialogProps {
  isOpen: boolean;
  systemPrompt: string;
  onSubmit: (systemPrompt: string) => void;
  onCancel: () => void;
}

export const SystemPromptDialog = ({
  isOpen,
  systemPrompt: initSystemPrompt,
  onSubmit,
  onCancel,
}: SystemPromptDialogProps) => {
  const [systemPrompt, setSystemPrompt] = useState(initSystemPrompt);

  const handleChangeSystemPrompt = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit(systemPrompt);
  }, [systemPrompt, onSubmit]);

  const handleCancel = useCallback(() => {
    setSystemPrompt(initSystemPrompt);
    onCancel();
  }, [initSystemPrompt, onCancel]);

  useEffect(() => {
    setSystemPrompt(initSystemPrompt);
  }, [initSystemPrompt]);

  return (
    <>
      <Dialog open={isOpen} onClose={handleCancel} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-lg bg-surface text-on-surface p-8 rounded">
            <DialogTitle className="text-xl font-bold">System Prompt</DialogTitle>
            <textarea
              className="w-full h-32 p-4 bg-surface-container text-on-surface resize-none my-4"
              value={systemPrompt}
              onChange={handleChangeSystemPrompt}
              placeholder="You are assistant bot."
            />
            <div className="flex justify-center gap-4">
              <button className="min-h-12 px-8 bg-primary text-on-primary" onClick={handleSubmit}>
                Submit
              </button>
              <button className="min-h-12 px-8 bg-surface-dim text-on-surface" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
