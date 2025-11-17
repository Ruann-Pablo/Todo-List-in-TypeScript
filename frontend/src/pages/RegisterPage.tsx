import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterForm } from '../schemas/AuthSchemas';
import { Input } from '../components/form/Input';
import { SubmitButton } from '../components/form/SubmitButton';
import { authService } from '../services/AuthServices';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterForm) {
    try {
      const res = await authService.register(data);

      localStorage.setItem("@token", res.token);

      alert("Registrado com sucesso");
      navigate("/HomePage"); 
    } catch (err: any) {
      alert(err?.message || "Erro ao registrar");
    }
  }

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input id="name" label="Nome" register={register('name')} errors={errors} />
        <Input id="email" label="Email" register={register('email')} errors={errors} />
        <Input id="password" label="Senha" register={register('password')} errors={errors} type="password" />
        <Input id="confirmPassword" label="Confirmar Senha" register={register('confirmPassword')} errors={errors} type="password" />
        <SubmitButton disabled={isSubmitting}>Registrar</SubmitButton>
      </form>
    </div>
  );
}