import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import styles from "./ProjectDetails.module.css";
import { ProjectService } from "../../services/ProjectServices";
import { TodoService, type TodoDTO } from "../../services/TodoServices";

import AddTodoModal from "../../components/modal/AddTodoModal";
import EditTodoModal from "../../components/modal/EditTodoModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import EditProjectModal from "../../components/modal/EditProjectModal";

import { Pen, Trash, CheckCircle, ArrowBigLeft } from "lucide-react";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // CREATE TODO
  const [openCreate, setOpenCreate] = useState(false);

  // EDIT TODO
  const [editingTodo, setEditingTodo] = useState<TodoDTO | null>(null);

  // DELETE TODO
  const [todoToDelete, setTodoToDelete] = useState<TodoDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  // DELETE PROJECT
  const [openDeleteProject, setOpenDeleteProject] = useState(false);

  // EDIT PROJECT
  const [openEditProject, setOpenEditProject] = useState(false);

  async function load() {
    try {
      const p = await ProjectService.getById(projectId);
      setProject(p);

      const all = await TodoService.getAll();
      setTodos(all.filter((t) => t.projectId === projectId));
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
      <div className={styles.wrapper}>
        <div className={styles.panel}>

          {/* HEADER DO PROJETO */}
          <header className={styles.header}>
            <h2>{project.name}</h2>
            <p className={styles.desc}>{project.description || "Sem descrição"}</p>
            <p className={styles.meta}>
              Criado em: {new Date(project.createdAt).toLocaleDateString()}
            </p>

            <div className={styles.controls}>
              <button
                onClick={() => setOpenEditProject(true)}
                className={styles.editButton}
              >
                <Pen />
              </button>

              <button
                className={styles.deleteButton}
                onClick={() => setOpenDeleteProject(true)}
              >
                <Trash />
              </button>
              <button
                className={styles.backButton}
                onClick={() => navigate("/projects")}
              >
                <ArrowBigLeft />
              </button>
            </div>
          </header>

          {/* TABELA DE PENDÊNCIAS */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pendência</th>
                <th>Criada em</th>
                <th className={styles.statusCol}>Status</th>
                <th className={styles.actionsCol}></th>
              </tr>
            </thead>

            <tbody>
              {todos.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.noItems}>
                    Nenhuma pendência ainda.
                  </td>
                </tr>
              ) : (
                todos.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {t.title}
                      {t.description && (
                        <span className={styles.descLabel}>{t.description}</span>
                      )}
                    </td>

                    <td>{new Date(t.createdAt).toLocaleDateString()}</td>

                    <td className={styles.statusCol}>
                      <button
                        className={styles.statusBtn}
                        onClick={() => toggleDone(t)}
                      >
                        {t.done ? (
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

                    <td className={styles.actionsCol}>
                      <button
                        className={styles.editButton}
                        onClick={() => setEditingTodo(t)}
                      >
                        <Pen />
                      </button>

                      <button
                        className={styles.deleteButton}
                        onClick={() => setTodoToDelete(t)}
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* BOTÃO FLUTUANTE */}
          <button
            className={styles.fab}
            onClick={() => setOpenCreate(true)}
          >
            +
          </button>
        </div>
      </div>

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

      <EditProjectModal
        open={openEditProject}
        onClose={() => setOpenEditProject(false)}
        projectId={projectId}
        initialName={project.name}
        initialDescription={project.description || ""}
        onUpdated={load}
      />
    </SidebarLayout>
  );
}
