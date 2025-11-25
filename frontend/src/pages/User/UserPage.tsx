import Sidebar from "../../components/sidebar/SideBar"; 
import Card from "../../components/card/Card";
import {Input} from "../../components/form/Input";
import { SubmitButton } from "../../components/form/SubmitButton";
import { useEffect, useState } from "react";
import { userService } from "../../services/UserServices";
import { useNavigate } from "react-router-dom";
import style from "./User.module.css";
import { CircleX } from "lucide-react";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);


  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await userService.getMe();
        setUser(data);

        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "" 
        });
      } catch (error) {
        console.log(error);
      }
    }

    loadUser();
  }, []);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
  e.preventDefault();

  const payload: any = {};

  if (form.name.trim() !== "") payload.name = form.name;
  if (form.email.trim() !== "") payload.email = form.email;
  if (form.password.trim() !== "") payload.password = form.password;

  try {
    const updatedUser = await userService.updateUser(user.id, payload);

    setMessage("Usuário atualizado com sucesso!");
    setMessageType("success");
    
    setUser(updatedUser);

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (error: any) {
    setMessage("Erro ao atualizar usuário");
    setMessageType("error");
  }
}


  async function handleDelete() {
    try {
      setMessage("Conta deletada com sucesso!");
      setMessageType("success");

      setTimeout(async () => {
        await userService.deleteUser(user.id);

      localStorage.removeItem("@token");
      localStorage.removeItem("@user");

      navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage("Erro ao deletar conta");
      setMessageType("error");
    }
  }

  function handleLogout() {
    setMessage("Saindo da conta...");
    setMessageType("success");
    
    setTimeout(() => {
      localStorage.removeItem("@token");
      localStorage.removeItem("@user");

      navigate("/");
    }, 1500);
  }

  if (!user) return navigate("/");

  return (
    <Sidebar>
      <Card
        title="Gerenciar Conta"
        description="Atualize suas informações de usuário."
      >
        {message && (
        <p className={
          messageType === "success" ? style.successMsg : style.errorMsg
        }>
          {message}
        </p>
      )}

        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            label="Nome"
            name="name"
            value={form.name ?? ''}
            onChange={handleChange}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            name="email"
            value={form.email ?? ''}
            onChange={handleChange}
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            name="password"
            value={form.password ?? ''}
            onChange={handleChange}
          />
          <SubmitButton>Salvar Alterações</SubmitButton>
        </form>
          <button onClick={handleDelete} className={style.deleteButton}>Deletar Conta</button>
          <button onClick={handleLogout} className={style.deleteButton}>Sair da Conta</button>
          <button onClick={() => navigate('/')} className={style.closeButton}><CircleX /></button>

      </Card>
    </Sidebar>
  );
}
