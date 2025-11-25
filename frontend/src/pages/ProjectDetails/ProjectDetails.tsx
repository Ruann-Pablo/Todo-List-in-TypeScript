import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import SidebarLayout from "../../components/sidebar/SideBar";
import { ProjectService, type ProjectDTO } from "../../services/ProjectServices";
import { TodoService } from "../../services/TodoServices";

import ProjectModal from "../../components/modal/ProjectModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import AddExistingTodoModal from "../../components/modal/AddExistingTodoModal";

import styles from "./ProjectDetails.module.css";

type TodoDTO = {
  id: number;
  title: string;
  description?: string;
  done: boolean;
  createdAt: string;
  projectId?: number | null;
};

type ProjectWithTodos = ProjectDTO & {
  todos?: TodoDTO[];
};

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectWithTodos | null>(null);
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // modals
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [openAddExisting, setOpenAddExisting] = useState(false);

  async function loadAll() {
    if (!id) return;
    setLoading(true);

    try {
      const projectData = await ProjectService.getById(Number(id));
      const allTodos = await TodoService.getAll();

      const projectTodos = allTodos.filter((t) => t.projectId === Number(id));

      setProject(projectData);
      setTodos(projectTodos);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados do projeto");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [id]);

  return (
    <SidebarLayout>
      <div className={styles.container}>
        {loading ? (
          <p>Carregando...</p>
        ) : project ? (
          <>
            {/* CARD DO PROJETO */}
            <div className={styles.card}>
              <h2 className={styles.projectTitle}>{project.name}</h2>
              <p className={styles.desc}>{project.description || "Sem descrição"}</p>

              <div className={styles.meta}>
                Criado em: {new Date(project.createdAt).toLocaleDateString()}
              </div>

              <div className={styles.actions}>
                <button className={styles.editButton} onClick={() => setOpenEdit(true)}>
                  Editar
                </button>

                <button className={styles.deleteButton} onClick={() => setDeleteOpen(true)}>
                  Excluir
                </button>
              </div>
            </div>

            {/* LISTA DE PENDÊNCIAS DO PROJETO */}
            <div className={styles.todosList}>
              <h3 className={styles.todosTitle}>Pendências do projeto</h3>

              {todos.length === 0 ? (
                <p className={styles.noTodos}>Nenhuma pendência cadastrada neste projeto.</p>
              ) : (
                todos.map((todo) => (
                  <div key={todo.id} className={styles.todoRow}>
                    <div className={styles.todoTitle}>
                      <input type="checkbox" checked={todo.done} readOnly />
                      <span className={todo.done ? styles.done : ""}>
                        {todo.title}
                      </span>
                    </div>

                    <span className={styles.todoDate}>
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}

              {/* BOTÃO: APENAS ADICIONAR PENDÊNCIA EXISTENTE */}
              <button
                className={styles.createTodoButton}
                onClick={() => setOpenAddExisting(true)}
              >
                + Adicionar pendência existente
              </button>
            </div>

            <button className={styles.backButton} onClick={() => navigate("/projects")}>
              ← Voltar
            </button>

            {/* MODAL: ADICIONAR PENDÊNCIA EXISTENTE */}
            <AddExistingTodoModal
              open={openAddExisting}
              onClose={() => setOpenAddExisting(false)}
              projectId={Number(id)}
              onAdded={loadAll}
            />

            {/* MODAL EDITAR PROJETO */}
            <ProjectModal
              open={openEdit}
              initial={{ name: project.name, description: project.description ?? "" }}
              title="Editar Projeto"
              onClose={() => setOpenEdit(false)}
              onSave={async (payload) => {
                await ProjectService.update(Number(id), payload);
                loadAll();
              }}
            />

            {/* CONFIRMAR DELETAR */}
            <ConfirmModal
              open={deleteOpen}
              title="Excluir projeto?"
              message="Ao excluir o projeto, todas as pendências serão removidas também."
              onClose={() => setDeleteOpen(false)}
              confirmLabel="Excluir"
              cancelLabel="Cancelar"
              loading={deleting}
              onConfirm={async () => {
                setDeleting(true);
                try {
                  await ProjectService.delete(Number(id));
                  navigate("/projects");
                } finally {
                  setDeleting(false);
                }
              }}
            />
          </>
        ) : (
          <p>Projeto não encontrado.</p>
        )}
      </div>
    </SidebarLayout>
  );
}
