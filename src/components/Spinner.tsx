import { cx } from '../libs';

export interface SpinnerProps {
  className?: string;
  removeDefaultStyle?: boolean;
}

export const Spinner = ({ className, removeDefaultStyle }: SpinnerProps) => (
  <div
    className={cx(
      'animate-spin rounded-full',
      !removeDefaultStyle && 'w-16 h-16 border-4 border-surface-dim border-t-primary',
      className,
    )}
  />
);
