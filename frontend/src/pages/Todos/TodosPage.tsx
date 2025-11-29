import { useEffect, useState } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { Pen, Trash, ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { TodoDTO } from "../../types/todo";
import { TodoService } from "../../services/TodoServices";

import styles from "./Todos.module.css";
import SidebarLayout from "../../components/sidebar/SideBar";
import Modal from "../../components/modal/CreateModal";
import ConfirmModal from "../../components/modal/ConfirmModal";

export default function TodosPage() {
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "done" | "undone">("all");
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTodo, setEditTodo] = useState<TodoDTO | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<TodoDTO | null>(null);

  const { requireAuth } = useAuthGuard();

  async function loadTodos() {
    setLoading(true);
    try {
      const data = await TodoService.getAll();
      setTodos(data.filter((t) => !t.projectId));
    } catch {
      alert("Erro ao carregar pendências");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  const filtered = todos
    .filter((t) =>
      filter === "done" ? t.done : filter === "undone" ? !t.done : true
    )
    .filter((t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      (t.description ?? "").toLowerCase().includes(query.toLowerCase())
    );

  async function handleCreate(title: string, description?: string) {
    try {
      const created = await TodoService.create({ title, description });
      setTodos(prev => [...prev, created]);
      setOpenCreate(false);
    } catch (err: any) {
      alert(err.message || "Erro ao criar pendência");
    }
  }

  async function handleEditSave(title: string) {
    if (!editTodo) return;
    try {
      await TodoService.update(editTodo.id, { title });
      setOpenEdit(false);
      setEditTodo(null);
      loadTodos();
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar pendência");
    }
  }

  async function handleDeleteConfirm() {
    if (!todoToDelete) return;
    setDeleting(true);
    try {
      await TodoService.delete(todoToDelete.id);
      setOpenDelete(false);
      setTodoToDelete(null);
      loadTodos();
    } catch {
      alert("Erro ao excluir pendência");
    } finally {
      setDeleting(false);
    }
  }

  async function toggleDone(todo: TodoDTO) {
    try {
      await TodoService.update(todo.id, { done: !todo.done });
      loadTodos();
    } catch {
      alert("Erro ao mudar status");
    }
  }

  return (
    <SidebarLayout>
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          <header className={styles.header}>
            <h2>Todas as pendências</h2>
            <div className={styles.controls}>
              <div className={styles.search}>
                <input
                  placeholder="Procurar"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className={styles.select}
              >
                <option value="all">Todos</option>
                <option value="done">Feitos</option>
                <option value="undone">N. Feitos</option>
              </select>
              <button
                className={styles.backButton}
                onClick={() => navigate("/")}
              >
                <ArrowBigLeft />
              </button>
            </div>
          </header>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pendência</th>
                <th>Dados</th>
                <th className={styles.statusCol}>Status</th>
                <th className={styles.actionsCol}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className={styles.loading}>Carregando...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.noItems}>Nenhuma pendência encontrada.</td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}{t.description && <span className={styles.descLabel}>Descrição</span>}</td>
                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className={styles.statusCol}>
                      <button className={styles.statusBtn} onClick={() => toggleDone(t)}>
                        {t.done ? <span className={`${styles.badge} ${styles.badgeDone}`}>Feito</span>
                        : <span className={`${styles.badge} ${styles.badgeUndone}`}>N. Feito</span>}
                      </button>
                    </td>
                    <td className={styles.actionsCol}>
                      <button className={`${styles.iconBtn} ${styles.pen}`} onClick={() => { setEditTodo(t); setOpenEdit(true); }}>
                        <Pen />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.trash}`} onClick={() => { setTodoToDelete(t); setOpenDelete(true); }}>
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button className={styles.fab} onClick={() => requireAuth(() => setOpenCreate(true))}>+</button>
        </div>
      </div>

      <Modal 
        open={openCreate} 
        onClose={() => setOpenCreate(false)} 
          Title="Criar nova pendência" 
          onSave={handleCreate} 
          redirectTo="/todos"
      />
      {editTodo && 
      <Modal 
      open={openEdit} 
      onClose={() => { 
        setOpenEdit(false); 
        setEditTodo(null); }} 
        Title="Editar pendência" 
        initial={{ title: editTodo.title }} 
        onSave={handleEditSave} redirectTo="/todos"
      />}
        
      <ConfirmModal 
        open={openDelete} 
        title="Deseja excluir esta pendência?" 
        message="Ao excluir você não verá mais este item." 
        onClose={() => setOpenDelete(false)} 
        onConfirm={handleDeleteConfirm} 
        confirmLabel="Excluir" 
        cancelLabel="Cancelar" 
        loading={deleting}
      />
    </SidebarLayout>
  );
}
