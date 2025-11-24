import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import Card from "../../components/card/Card";
import { ProjectService } from "../../services/ProjectServices";
import type { ProjectDTO } from "../../services/ProjectServices";
import styles from "./Project.module.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <h1 className={styles.title}>Seus Projetos</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.grid}>
            {projects.map((p) => (
              <Card key={p.id} title={p.name} description={p.description ?? "Sem descrição"}>
                <button
                  className={styles.accessButton}
                  onClick={() => navigate(`/projects/${p.id}`)}
                >
                  Acessar
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
