import { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterForm } from '../../schemas/AuthSchemas';
import { Input } from '../../components/form/Input';
import { SubmitButton } from '../../components/form/SubmitButton';
import { authService } from '../../services/AuthServices';
import { useNavigate } from 'react-router-dom';
import style from './Register.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterForm) {
    try {
      const res = await authService.register(data);

      localStorage.setItem("@token", res.token);

      setMessageType("success");
      setMessage("Registrado com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err: any) {
      setMessageType("error");
      setMessage(err?.message || "Erro ao registrar");
    }
  }

  return (
    <div className={style.container}>
      <h1 className={style.h1}>Cadastro</h1>

      {/* Mensagem de sucesso ou error */}
      {message && (
        <p className={
          messageType === "success" ? style.successMsg : style.errorMsg
        }>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={style.formgroup}>
        <Input 
          id="name" 
          label="Nome"
          register={register("name")}
          errors={errors}
        />

        <Input 
          id="email" 
          label="Email"
          register={register("email")}
          errors={errors}
        />

        <Input 
          id="password" 
          label="Senha" 
          type="password"
          register={register("password")}
          errors={errors}
        />

        <Input 
          id="confirmPassword" 
          label="Confirmar Senha"
          type="password"
          register={register("confirmPassword")}
          errors={errors}
        />

        <SubmitButton disabled={isSubmitting}>
          Registrar
        </SubmitButton>
      </form>
    </div>
  );
}
