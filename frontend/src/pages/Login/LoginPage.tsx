import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '../../schemas/AuthSchemas';
import { Input } from '../../components/form/Input';
import { SubmitButton } from '../../components/form/SubmitButton';
import { authService } from '../../services/AuthServices';
import { useNavigate, Link } from 'react-router-dom';
import style from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    try {
      const res = await authService.login(data);

      localStorage.setItem("@token", res.token);
      localStorage.setItem("@user", JSON.stringify(res.user));

      setMessageType("success");
      setMessage("Logado com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 2000); 
    } catch (err: any) {

      setMessageType("error");

      if (err.response?.status === 400) {
        setMessage("Credenciais inválidas");
      } else if (err.response?.status === 401) {
        setMessage("Não autorizado");
      } else {
        setMessage("Erro ao logar");
      }
    }
}

  return (
    <div className={style.container}>
      <h1 className={style.h1}>Login</h1>

      {/* Mensagem de sucesso ou error */}
      {message && (
        <p className={
          messageType === "success" ? style.successMsg : style.errorMsg
        }>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={style.formgroup}>
        <Input id="email" label="Email" register={register('email')} errors={errors} />
        <Input id="password" label="Senha" register={register('password')} errors={errors} type="password" />
        <SubmitButton disabled={isSubmitting}>Entrar</SubmitButton>
      </form>
      <p className={style.paragraph}>Não possui Login? <Link to="/users/register"><strong className='strong'>Registrar</strong></Link></p>
    </div>
    );
}