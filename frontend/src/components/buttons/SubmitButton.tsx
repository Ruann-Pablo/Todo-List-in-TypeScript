import React from 'react';
import style from './Buttons.module.css';

export const SubmitButton: React.FC<{ children?: React.ReactNode; disabled?: boolean }> = ({ children, disabled }) => {
  return (
    <button type="submit" disabled={disabled} className={style.submitButton}>
    {children}
    </button>
  );
};