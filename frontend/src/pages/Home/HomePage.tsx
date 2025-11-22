import { useState } from "react";
import SidebarLayout from "../../components/sidebar/SideBar";
import Card from "../../components/card/Card";
import Modal from "../../components/modal/Modal";
import styles from "./Home.module.css";
import { createProject } from "../../services/ProjectServices";

export default function HomePage() {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);

  return (
    <div className={styles.container}>
      <SidebarLayout>

        <Card 
          title="Crie sua tarefa" 
          description="Gerencie suas tarefas de forma eficiente."
        >
          <button className={styles.Button} onClick={() => setOpenTaskModal(true)}>
            Criar Nova Tarefa
          </button>

          <Modal
            open={openTaskModal}
            onClose={() => setOpenTaskModal(false)}
            Title="Criar nova tarefa"
            redirectTo="/todos"
            onSave={async (taskName) => {
              await createProject({ name: taskName });
              setOpenTaskModal(false); // FECHA O MODAL
            }}
          />
        </Card>

        <Card 
          title="Crie seu projeto" 
          description="Organize seus projetos."
        >
          <button className={styles.Button} onClick={() => setOpenProjectModal(true)}>
            Criar Novo Projeto
          </button>

          <Modal
            open={openProjectModal}
            onClose={() => setOpenProjectModal(false)}
            Title="Criar novo projeto"
            redirectTo="/projects"
            onSave={async (projectName) => {
              await createProject({ name: projectName });
              setOpenProjectModal(false); // FECHA O MODAL
            }}
          />
        </Card>

      </SidebarLayout>
    </div>
  );
}
