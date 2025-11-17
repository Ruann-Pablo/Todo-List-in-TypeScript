import React from 'react';


export const SubmitButton: React.FC<{ children?: React.ReactNode; disabled?: boolean }> = ({ children, disabled }) => {
  return (
    <button type="submit" disabled={disabled} style={{ padding: '8px 12px' }}>
    {children}
    </button>
  );
};