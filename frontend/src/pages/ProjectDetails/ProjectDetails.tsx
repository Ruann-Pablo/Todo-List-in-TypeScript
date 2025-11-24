import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import { ProjectService, type ProjectDTO } from "../../services/ProjectServices";
import styles from "./ProjectDetails.module.css";
import ProjectModal from "../../components/modal/ProjectModal";
import ConfirmModal from "../../components/modal/ConfirmModal";

type ProjectWithTodos = ProjectDTO & {
  todos?: Array<{ id: number; title: string; description?: string; done: boolean; createdAt: string }>;
};

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectWithTodos | null>(null);
  const [loading, setLoading] = useState(true);

  // estados dos modais
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const data = await ProjectService.getById(Number(id));
      setProject(data as ProjectWithTodos);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar projeto");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function handleSaveEdit(payload: { name: string; description?: string }) {
    if (!id) return;
    try {
      await ProjectService.update(Number(id), payload);
      await load();
      alert("Projeto atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar projeto");
    }
  }

  async function handleDelete() {
    if (!id) return;
    setDeleting(true);
    try {
      await ProjectService.delete(Number(id));
      alert("Projeto excluído com sucesso!");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir projeto");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <SidebarLayout>
      <div className={styles.container}>
        {loading ? (
          <p>Carregando...</p>
        ) : project ? (
          <>
            {/* Card do Projeto */}
            <div className={styles.card}>
              <h2 className={styles.projectTitle}>{project.name}</h2>
              <p className={styles.desc}>{project.description || "Sem descrição"}</p>
              <div className={styles.meta}>
                Criado em: {new Date(project.createdAt).toLocaleDateString()}
              </div>

              {/* Botões Editar / Excluir */}
              <div className={styles.actions}>
                <button className={styles.editButton} onClick={() => setEditOpen(true)}>
                  Editar
                </button>

                <button className={styles.deleteButton} onClick={() => setDeleteOpen(true)}>
                  Excluir
                </button>
              </div>
            </div>

            {/* Lista de TODOS */}
            <div className={styles.todosList}>
              <h3 className={styles.todosTitle}>Pendências do projeto</h3>

              {project.todos && project.todos.length > 0 ? (
                project.todos.map((todo) => (
                  <div key={todo.id} className={styles.todoRow}>
                    <div className={styles.todoTitle}>
                      <input type="checkbox" checked={todo.done} readOnly />
                      <span className={todo.done ? styles.done : ""}>{todo.title}</span>
                    </div>
                    <span className={styles.todoDate}>
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.noTodos}>Nenhuma pendência cadastrada neste projeto.</p>
              )}
            </div>

            {/* Botão Voltar */}
            <button className={styles.backButton} onClick={() => navigate("/projects")}>
              Voltar
            </button>

            {/* Modal de Edição */}
            <ProjectModal
              open={editOpen}
              initial={{
                name: project.name,
                description: project.description ?? "",
              }}
              title="Editar Projeto"
              onClose={() => setEditOpen(false)}
              onSave={handleSaveEdit}
            />

            {/* Modal de Exclusão */}
            <ConfirmModal
              open={deleteOpen}
              title="Deseja excluir este projeto?"
              message="Ao excluir, você perderá todas as pendências deste projeto."
              confirmLabel="Excluir"
              cancelLabel="Cancelar"
              onClose={() => setDeleteOpen(false)}
              onConfirm={handleDelete}
              loading={deleting}
            />
          </>
        ) : (
          <p>Projeto não encontrado.</p>
        )}
      </div>
    </SidebarLayout>
  );
}
