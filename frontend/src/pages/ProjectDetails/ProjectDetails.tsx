import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import { ProjectService, type ProjectDTO } from "../../services/ProjectServices";
import styles from "./ProjectDetails.module.css";

type ProjectWithTodos = ProjectDTO & { 
  todos?: Array<{ id: number; title: string; description?: string; done: boolean; createdAt: string }> 
};

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectWithTodos | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { load(); }, [id]);

  if (!id) {
    return (
      <SidebarLayout>
        <div className={styles.container}><p>ID do projeto inválido.</p></div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className={styles.container}>

        {/* === REMOVIDO O TÍTULO "Projeto" === */}

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
            </div>

            {/* LISTA DE TODOS */}
            <div className={styles.todosList}>
              <h3 className={styles.todosTitle}>Pendências do projeto</h3>

              {project.todos && project.todos.length > 0 ? (
                project.todos.map(todo => (
                  <div key={todo.id} className={styles.todoRow}>
                    <div className={styles.todoTitle}>
                      <input type="checkbox" checked={!!todo.done} readOnly />
                      <span className={todo.done ? styles.done : ""}>{todo.title}</span>
                    </div>
                    <div className={styles.todoDate}>
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.noTodos}>Nenhuma pendência cadastrada neste projeto.</p>
              )}
            </div>

            {/* BOTÃO VOLTAR NO FINAL */}
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              Voltar
            </button>
          </>
        ) : (
          <p>Projeto não encontrado.</p>
        )}
      </div>
    </SidebarLayout>
  );
}
