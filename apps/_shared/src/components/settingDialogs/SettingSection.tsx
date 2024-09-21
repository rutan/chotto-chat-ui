import { cx } from '../../libs';

export const SettingSection = ({ className, children }: { className?: string; children?: React.ReactNode }) => (
  <section className={cx('mb-6', className)}>{children}</section>
);
