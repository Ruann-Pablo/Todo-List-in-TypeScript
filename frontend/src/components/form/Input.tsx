import React from 'react';
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import style from './form.module.css';

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
    <div className={style.container}>
      {label && <label htmlFor={id} className={style.label}>{label}</label>}
    <input id={id} {...register} type={type} className={style.input}/>
      {err && <small className={style.error}>{err.message?.toString()}</small>}
    </div>
  );
};