import { useState } from "react";
import SidebarLayout from "../../components/sidebar/SideBar";
import Card from "../../components/card/Card";
import Modal from "../../components/modal/Modal";
import styles from "./Home.module.css";
import { createProject } from "../../services/ProjectServices";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function HomePage() {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const { requireAuth } = useAuthGuard();

  function handleCreateTodo() {
    requireAuth(() => {
      setOpenTaskModal(true);
    });
  }

  function handleCreateProject() {
    requireAuth(() => {
      setOpenProjectModal(true);
    });
  }

  return (
    <div className={styles.container}>
      <SidebarLayout>

        <Card 
          title="Crie sua tarefa" 
          description="Gerencie suas tarefas de forma eficiente."
        >
          <button 
            className={styles.Button} 
            onClick={handleCreateTodo}
          >
            Criar Nova Tarefa
          </button>

          <Modal
            open={openTaskModal}
            onClose={() => setOpenTaskModal(false)}
            Title="Criar nova tarefa"
            redirectTo="/todos"
            onSave={async (taskName) => {
              await createProject({ name: taskName });
              setOpenTaskModal(false); // **IMPORTANTE**
            }}
          />
        </Card>

        <Card 
          title="Crie seu projeto" 
          description="Organize seus projetos."
        >
          <button 
            className={styles.Button} 
            onClick={handleCreateProject}
          >
            Criar Novo Projeto
          </button>

          <Modal
            open={openProjectModal}
            onClose={() => setOpenProjectModal(false)}
            Title="Criar novo projeto"
            redirectTo="/projects"
            onSave={async (projectName) => {
              await createProject({ name: projectName });
              console.log("Projeto criado:", projectName);
              setOpenProjectModal(false); 
            }}
          />
        </Card>

      </SidebarLayout>
    </div>
  );
}
