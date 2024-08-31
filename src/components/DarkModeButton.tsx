import React from 'react';
import { useDarkMode } from '../hooks';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

export interface DarkModeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string;
}

export const DarkModeButton = ({ iconClassName, ...props }: DarkModeButtonProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleClick = () => {
    toggleDarkMode();
  };

  return (
    <button onClick={handleClick} {...props}>
      {isDarkMode ? (
        <MdDarkMode className={iconClassName} title="Change to light mode" />
      ) : (
        <MdLightMode className={iconClassName} title="Change to dark mode" />
      )}
    </button>
  );
};
