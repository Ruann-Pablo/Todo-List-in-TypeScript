import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectService } from "../../services/ProjectServices";
import { TodoService } from "../../services/TodoServices";

import type { ProjectDTO } from "../../types/projects";
import type { TodoDTO } from "../../types/todo";

import { Pen, Trash, ArrowBigLeft } from "lucide-react";
import styles from "./ProjectDetails.module.css";

import SidebarLayout from "../../components/sidebar/SideBar";
import AddTodoModal from "../../components/modal/AddTodoModal";
import EditTodoModal from "../../components/modal/EditTodoModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import EditProjectModal from "../../components/modal/EditProjectModal";


export default function ProjectDetailsPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [openCreate, setOpenCreate] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoDTO | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<TodoDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const [openEditProject, setOpenEditProject] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const p = await ProjectService.getById(projectId);
      setProject(p);

      const allTodos = await TodoService.getAll();
      setTodos(allTodos.filter(t => t.projectId === projectId));
    } catch {
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleDone(todo: TodoDTO) {
    await TodoService.update(todo.id, { done: !todo.done });
    load();
  }

  async function deleteTodo() {
    if (!todoToDelete) return;
    setDeleting(true);
    await TodoService.delete(todoToDelete.id);
    setDeleting(false);
    setTodoToDelete(null);
    load();
  }

  async function deleteProject() {
    await ProjectService.delete(projectId);
    navigate("/projects");
  }

  if (loading) return <SidebarLayout><p>Carregando...</p></SidebarLayout>;
  if (!project) return null;

  return (
    <SidebarLayout>
      <div className={styles.wrapper}>
        <div className={styles.panel}>
          {/* HEADER */}
          <header className={styles.header}>
            <h2>{project.name}</h2>
            <p>{project.description || "Sem descrição"}</p>
            <p>Criado em: {new Date(project.createdAt).toLocaleDateString()}</p>

            <div className={styles.controls}>
              <button className={styles.editButton} onClick={() => setOpenEditProject(true)}><Pen /></button>
              <button className={styles.deleteButton} onClick={() => setOpenDeleteProject(true)}><Trash /></button>
              <button className={styles.backButton} onClick={() => navigate("/projects")}><ArrowBigLeft /></button>
            </div>
          </header>

          {/* TABELA DE TODOS */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pendência</th>
                <th>Criada em</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {todos.length === 0 ? (
                <tr><td colSpan={4}>Nenhuma pendência ainda.</td></tr>
              ) : todos.map(todo => (
                <tr key={todo.id}>
                  <td>{todo.title}{todo.description && <span className={styles.descLabel}>{todo.description}</span>}</td>
                  <td>
                    {new Date(todo.createdAt).toLocaleDateString()}
                    </td>
                  <td className={styles.statusCol}>
                    <button
                      className={styles.statusBtn}
                      onClick={() => toggleDone(todo)}
                    >
                      {todo .done ? (
                        <span className={`${styles.badge} ${styles.badgeDone}`}>
                          Feito
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgeUndone}`}>
                          N. Feito
                        </span>
                      )}
                    </button>
                  </td>
                  <td>
                    <button className={styles.editButton} onClick={() => setEditingTodo(todo)}><Pen /></button>
                    <button className={styles.deleteButton} onClick={() => setTodoToDelete(todo)}><Trash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className={styles.fab} onClick={() => setOpenCreate(true)}>+</button>
        </div>
      </div>

      {/* MODAIS */}
      <AddTodoModal open={openCreate} onClose={() => setOpenCreate(false)} projectId={projectId} onCreated={load} />
      {editingTodo && <EditTodoModal open onClose={() => setEditingTodo(null)} todo={editingTodo} onUpdated={load} />}
      {todoToDelete && <ConfirmModal open onClose={() => setTodoToDelete(null)} onConfirm={deleteTodo} title="Excluir pendência?" message="Essa ação não pode ser desfeita." confirmLabel="Excluir" cancelLabel="Cancelar" loading={deleting} />}
      <ConfirmModal open={openDeleteProject} onClose={() => setOpenDeleteProject(false)} onConfirm={deleteProject} title="Excluir Projeto" message="Tem certeza?" confirmLabel="Excluir" cancelLabel="Cancelar" />
      <EditProjectModal open={openEditProject} onClose={() => setOpenEditProject(false)} projectId={projectId} initialName={project.name} initialDescription={project.description || ""} onUpdated={load} />
    </SidebarLayout>
  );
}
