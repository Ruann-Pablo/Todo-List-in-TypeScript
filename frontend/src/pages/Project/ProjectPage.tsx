import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/sidebar/SideBar";
import Card from "../../components/card/Card";
import { ProjectService } from "../../services/ProjectServices";
import type { ProjectDTO } from "../../services/ProjectServices";
import styles from "./Project.module.css";
import Modal from "../../components/modal/CreateModal";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { Trash, ArrowBigLeft } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState("");

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectDTO | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  async function loadProjects() {
    try {
      const data = await ProjectService.getAll();
      const sorted = data.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setProjects(sorted);
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
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
    } catch {
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

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SidebarLayout>
      <div className={styles.container}>

        {/* Cabeçalho */}
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Seus Projetos</h1>
          <div className={styles.navButton}>
            <div className={styles.search}>
              <input
                placeholder="Procurar"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <button
              className={styles.createButton}
              onClick={() => setOpenModal(true)}
            >
              Criar Novo Projeto
            </button>

            <button
              className={styles.backButton}
              onClick={() => navigate("/")}
            >
              <ArrowBigLeft />
            </button>
          </div>
        </div>

        {/* Lista de projetos */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.grid}>
            {filtered.length === 0 ? (
              <p>Nenhum projeto encontrado.</p>
            ) : (
              filtered.map(p => (
                <div key={p.id} className={styles.cardWrapper}>
                  <Card title={p.name} description={p.description ?? "Sem descrição"}>
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
              ))
            )}
          </div>
        )}

        {/* Modal de criação */}
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          Title="Criar novo projeto"
          redirectTo="/projects"
          onSave={async (projectName) => {
            try {
              const created = await ProjectService.create({ name: projectName });
              setOpenModal(false);

              // Adiciona novo projeto no final da lista
              setProjects(prev => [...prev, created]);
            } catch {
              alert("Erro ao criar projeto");
            }
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
