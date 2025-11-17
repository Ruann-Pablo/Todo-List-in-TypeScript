import React from 'react';
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  id: string;
  label?: string;
  register: UseFormRegisterReturn;
  errors?: FieldErrors;
  type?: string;
};

export const Input: React.FC<Props> = ({ id, label, register, errors, type = 'text' }) => {
  const err = errors && (errors as any)[id];

  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label htmlFor={id}>{label}</label>}
    <input id={id} {...register} type={type} style={{ display: 'block', width: '100%', padding: 8 }} />
      {err && <small style={{ color: 'red' }}>{err.message?.toString()}</small>}
    </div>
  );
};