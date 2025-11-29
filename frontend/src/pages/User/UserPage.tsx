import Sidebar from "../../components/sidebar/SideBar"; 
import Card from "../../components/card/Card";
import {Input} from "../../components/form/Input";
import { SubmitButton } from "../../components/buttons/SubmitButton";
import { useEffect, useState } from "react";
import { userService } from "../../services/UserServices";
import { useNavigate, Navigate } from "react-router-dom";
import style from "./User.module.css";
import CloseButton from "../../components/buttons/CloseButton";
import Message from "../../components/message/Message";
import ConfirmModal from "../../components/modal/ConfirmModal";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

  async function handleDeleteConfirm() {
  if (!user) return;

  setDeleting(true);

  try {
    await userService.deleteUser(user.id);

    localStorage.removeItem("@token");
    localStorage.removeItem("@user");

    setMessage("Conta deletada com sucesso!");
    setMessageType("success");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  } catch (error) {
    console.error(error);
    setMessage("Erro ao deletar conta");
    setMessageType("error");
  } finally {
    setDeleting(false);
    setOpenConfirmDelete(false);
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

  if (loading) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/" replace />;

  return (
    <Sidebar>
      <Card
        title="Gerenciar Conta"
        description="Atualize suas informações de usuário."
      >
        <Message message={message} type={messageType ?? undefined} />

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
          <button
            onClick={() => setOpenConfirmDelete(true)}
            className={style.deleteButton}
          >
            Deletar Conta
          </button>

          <ConfirmModal
            open={openConfirmDelete}
            title="Deseja realmente deletar sua conta?"
            message="Esta ação não pode ser desfeita."
            confirmLabel="Deletar"
            cancelLabel="Cancelar"
            loading={deleting}
            onClose={() => setOpenConfirmDelete(false)}
            onConfirm={handleDeleteConfirm}
          />


          <button onClick={handleLogout} className={style.deleteButton}>Sair da Conta</button>
          <CloseButton to="/" />

      </Card>
    </Sidebar>
  );
}
