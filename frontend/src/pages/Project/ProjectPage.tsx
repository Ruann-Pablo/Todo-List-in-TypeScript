import { useEffect, useState } from "react";
import SidebarLayout from "../../components/sidebar/SideBar";
import { ProjectService } from "../../services/ProjectServices";
import type { ProjectDTO } from "../../services/ProjectServices";
import styles from "./Project.module.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    try {
      const data = await ProjectService.getAll();
      setProjects(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar projetos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <SidebarLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>Meus Projetos</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.grid}>
            {projects.map((p) => (
              <div key={p.id} className={styles.card}>
                <h2>{p.name}</h2>
                <p>{p.description || "Sem descrição"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
