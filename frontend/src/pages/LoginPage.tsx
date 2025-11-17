import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '../schemas/AuthSchemas';
import { Input } from '../components/form/Input';
import { SubmitButton } from '../components/form/SubmitButton';
import { authService } from '../services/AuthServices';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
  try {
    const res = await authService.login(data);

    // Se quiser, pode salvar token localmente
    localStorage.setItem("@token", res.token);

    alert("Logado com sucesso");

    navigate("/"); // volte para Home
  } catch (err: any) {
    alert(err?.message || "Erro ao logar");
  }
}

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input id="email" label="Email" register={register('email')} errors={errors} />
        <Input id="password" label="Senha" register={register('password')} errors={errors} type="password" />
        <SubmitButton disabled={isSubmitting}>Entrar</SubmitButton>
      </form>
    </div>
    );
}