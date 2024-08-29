import React from 'react';
import { Select } from '@headlessui/react';
import { Model } from '../libs';

export interface ModelSelectorProps {
  models: Model[];
  onChange: (model: Model) => void;
}

export const ModelSelector = ({ models, onChange }: ModelSelectorProps) => {
  if (models.length === 0) {
    return (
      <Select disabled>
        <option>Loading...</option>
      </Select>
    );
  }

  return (
    <Select
      name="model"
      aria-label="use models"
      onChange={(e) => {
        const model = models.find((model) => model.name === e.target.value);
        if (model) {
          onChange(model);
        }
      }}
    >
      <option>Select Model</option>
      {models.map((model) => (
        <option key={model.name} value={model.name}>
          {model.name}
        </option>
      ))}
    </Select>
  );
};
