import React from 'react';
import { Select } from '@headlessui/react';
import { cx, Model } from '../libs';

export interface ModelSelectorProps {
  models: Model[];
  onChange: (model: Model | null) => void;
  className?: string;
  disabled?: boolean;
}

export const ModelSelector = ({ models, className, disabled, onChange }: ModelSelectorProps) => {
  return (
    <Select
      name="model"
      aria-label="use models"
      className={cx(
        'h-10 px-2 bg-surface-bright text-on-surface border border-outline rounded disabled:opacity-20',
        className,
      )}
      onChange={(e) => {
        const model = models.find((model) => model.name === e.target.value);
        onChange(model ?? null);
      }}
      disabled={disabled || models.length === 0}
    >
      {models.length > 1 ? (
        <>
          <option>Select Model</option>
          {models.map((model) => (
            <option key={model.name} value={model.name}>
              {model.name}
            </option>
          ))}
        </>
      ) : (
        <option>Loading...</option>
      )}
    </Select>
  );
};
