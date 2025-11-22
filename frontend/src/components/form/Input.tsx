import React from 'react';
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import style from './form.module.css';

type Props = {
  id?: string;
  label?: string;
  register?: UseFormRegisterReturn;
  errors?: FieldErrors;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<Props> = ({
  id,
  label,
  register,
  errors,
  type = 'text',
  value,
  onChange
}) => {
  const err = errors && id ? (errors as any)[id] : null;

  return (
    <div className={style.container}>
      {label && (
        <label htmlFor={id} className={style.label}>
          {label}
        </label>
      )}

      <input
        {...(id ? { id } : {})}
        {...(register ? register : {})}
        type={type}
        className={style.input}
        value={value}
        onChange={onChange}
      />

      {err && (
        <small className={style.error}>{err.message?.toString()}</small>
      )}
    </div>
  );
};