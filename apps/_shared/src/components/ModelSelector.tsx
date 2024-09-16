import { Field, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MdArrowDropDown, MdRefresh } from 'react-icons/md';
import type { OllamaModel } from '../entities';
import { useModels } from '../hooks';
import { cx } from '../libs';
import { Spinner } from './Spinner';

export interface ModelSelectorProps {
  selectedModelName?: string | null;
  onChange: (model: OllamaModel | null) => void;
  className?: string;
  disabled?: boolean;
}

export const ModelSelector = ({ selectedModelName, className, disabled, onChange }: ModelSelectorProps) => {
  const { t } = useTranslation();
  const { data: models = [], isLoading, isError, refetch } = useModels();
  const selectedModel = useMemo(
    () => models.find((model) => model.name === selectedModelName) ?? null,
    [models, selectedModelName],
  );

  const handleClickRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    onChange(selectedModel);
  }, [selectedModel, onChange]);

  if (isLoading) {
    return (
      <div className={cx('ModelSelector', 'flex items-center', className)}>
        <Spinner className="w-6 h-6 border-2 border-surface-dim border-t-primary" removeDefaultStyle />
      </div>
    );
  }

  return (
    <div className={cx('ModelSelector', 'flex items-center relative', className)}>
      <Field className="h-full" disabled={disabled || isError}>
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
      <div>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 text-on-surface rounded hover:bg-surface-dim"
          onClick={handleClickRefresh}
        >
          <MdRefresh className="block w-6 h-6 cursor-pointer text-on-surface" title={t('ModelSelector.reload')} />
        </button>
      </div>
    </div>
  );
};
