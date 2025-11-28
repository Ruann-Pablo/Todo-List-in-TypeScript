import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import styles from "./ProjectDetails.module.css";
import { ProjectService } from "../../services/ProjectServices";
import { TodoService, type TodoDTO } from "../../services/TodoServices";

import AddTodoModal from "../../components/modal/AddTodoModal";
import EditTodoModal from "../../components/modal/EditTodoModal";
import ConfirmModal from "../../components/modal/ConfirmModal";

import { Pen, Trash, CheckCircle } from "lucide-react";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // CREATE
  const [openCreate, setOpenCreate] = useState(false);

  // EDIT
  const [editingTodo, setEditingTodo] = useState<TodoDTO | null>(null);

  // DELETE
  const [todoToDelete, setTodoToDelete] = useState<TodoDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  // DELETE PROJECT
  const [openDeleteProject, setOpenDeleteProject] = useState(false);

  async function load() {
    try {
      const p = await ProjectService.getById(projectId);
      setProject(p);

      const all = await TodoService.getAll();
      setTodos(all.filter(t => t.projectId === projectId));
    } catch {
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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

  if (loading)
    return (
      <SidebarLayout>
        <p>Carregando...</p>
      </SidebarLayout>
    );

  return (
    <SidebarLayout>
      <div className={styles.container}>

        {/* CARD DO PROJETO */}
        <div className={styles.card}>
          <h2 className={styles.projectTitle}>{project.name}</h2>
          <p className={styles.desc}>{project.description || "Sem descrição"}</p>
          <p className={styles.meta}>
            Criado em: {new Date(project.createdAt).toLocaleDateString()}
          </p>

          <div className={styles.actions}>
            <button
              onClick={() => navigate(`/projects/edit/${projectId}`)}
              className={styles.editButton}
            >
              Editar
            </button>

            <button
              className={styles.deleteButton}
              onClick={() => setOpenDeleteProject(true)}
            >
              Excluir
            </button>
          </div>
        </div>

        {/* LISTA DE PENDÊNCIAS */}
        <div className={styles.todosList}>
          <h3 className={styles.todosTitle}>Pendências do projeto</h3>

          {todos.length === 0 ? (
            <p className={styles.noTodos}>Nenhuma pendência ainda.</p>
          ) : (
            todos.map((t) => (
              <div key={t.id} className={styles.todoRow}>
                <div className={styles.todoTitle}>
                  <span className={styles.dot}></span>
                  <span className={t.done ? styles.done : ""}>{t.title}</span>
                </div>

                <div>
                  <button className={styles.iconBtn} onClick={() => toggleDone(t)}>
                    <CheckCircle />
                  </button>

                  <button className={styles.iconBtn} onClick={() => setEditingTodo(t)}>
                    <Pen />
                  </button>

                  <button
                    className={styles.iconBtn}
                    onClick={() => setTodoToDelete(t)}
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* CRIAR PENDÊNCIA */}
          <button
            className={styles.createTodoButton}
            onClick={() => setOpenCreate(true)}
          >
            Criar nova pendência
          </button>
        </div>

        {/* VOLTAR */}
        <button className={styles.backButton} onClick={() => navigate("/projects")}>
          Voltar
        </button>

        {/* MODAIS */}
        <AddTodoModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          projectId={projectId}
          onCreated={load}
        />

        {editingTodo && (
          <EditTodoModal
            open={!!editingTodo}
            onClose={() => setEditingTodo(null)}
            todo={editingTodo}
            onUpdated={load}
          />
        )}

        {todoToDelete && (
          <ConfirmModal
            open={!!todoToDelete}
            onClose={() => setTodoToDelete(null)}
            onConfirm={deleteTodo}
            title="Excluir pendência?"
            message="Essa ação não pode ser desfeita."
            confirmLabel="Excluir"
            cancelLabel="Cancelar"
            loading={deleting}
          />
        )}

        <ConfirmModal
          open={openDeleteProject}
          onClose={() => setOpenDeleteProject(false)}
          onConfirm={deleteProject}
          title="Excluir Projeto"
          message="Tem certeza?"
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
        />
      </div>
    </SidebarLayout>
  );
}
