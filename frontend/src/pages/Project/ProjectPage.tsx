import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import Card from "../../components/card/Card";
import { ProjectService } from "../../services/ProjectServices";
import type { ProjectDTO } from "../../services/ProjectServices";
import styles from "./Project.module.css";
import Modal from "../../components/modal/CreateModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { Trash } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function deleteProject() {
    if (!projectToDelete) return;

    setDeleting(true);

    try {
      await ProjectService.delete(projectToDelete.id);
      loadProjects();
    } catch (err) {
      alert("Erro ao excluir projeto");
    } finally {
      setDeleting(false);
      setOpenDelete(false);
      setProjectToDelete(null);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <SidebarLayout>
      <div className={styles.container}>

        {/* Cabeçalho */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Seus Projetos</h1>

          <button
            className={styles.createButton}
            onClick={() => setOpenModal(true)}
          >
            Criar Novo Projeto
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.grid}>
            {projects.map((p) => (
              <div key={p.id} className={styles.cardWrapper}>
                <Card
                  title={p.name}
                  description={p.description ?? "Sem descrição"}
                >
                  {/*  Botão excluir dentro do card */}
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      setProjectToDelete(p);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash size={18} />
                  </button>

                  <button
                    className={styles.accessButton}
                    onClick={() => navigate(`/projects/${p.id}`)}
                  >
                    Acessar
                  </button>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Modal de criação */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          Title="Criar novo projeto"
          redirectTo="/projects"
          onSave={async (projectName) => {
            await ProjectService.create({ name: projectName });
            setOpenModal(false);
            loadProjects();
          }}
        />

        {/* Modal de exclusão */}
        <ConfirmModal
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={deleteProject}
          title="Excluir Projeto"
          message="Tem certeza que deseja excluir este projeto?"
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          loading={deleting}
        />
      </div>
    </SidebarLayout>
  );
}
