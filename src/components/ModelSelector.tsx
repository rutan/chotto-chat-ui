import { Field, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { MdArrowDropDown } from 'react-icons/md';
import { type Model, cx } from '../libs';

export interface ModelSelectorProps {
  selectedModel: Model | null;
  models: Model[];
  onChange: (model: Model | null) => void;
  className?: string;
  disabled?: boolean;
}

export const ModelSelector = ({ selectedModel, models, className, disabled, onChange }: ModelSelectorProps) => {
  const { t } = useTranslation();

  return (
    <Field className={cx('ModelSelector', 'relative', className)} disabled={disabled}>
      <Listbox value={selectedModel} onChange={onChange}>
        <ListboxButton className="flex items-center gap-1 px-2 h-full bg-transparent text-on-surface text-center rounded disabled:opacity-20 hover:bg-surface-container-highest">
          <span className="font-bold">{selectedModel?.name ?? t('ModelSelector.selectModel')}</span>
          <MdArrowDropDown className="w-6 h-6" />
        </ListboxButton>
        <ListboxOptions className="bg-surface-bright shadow-md rounded z-30" anchor="bottom">
          {models.map((model) => (
            <ListboxOption
              key={model.name}
              className="p-4 cursor-pointer data-[focus]:bg-surface-container text-on-surface"
              value={model}
            >
              {model.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
};
