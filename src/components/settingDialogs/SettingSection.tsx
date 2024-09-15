import { cx } from '../../libs';

export const SettingSection = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <section className={cx('mb-4', className)}>{children}</section>
);
