import { useState } from "react";
import SidebarLayout from "../../components/sidebar/SideBar";
import Card from "../../components/card/Card";
import Modal from "../../components/modal/Modal";
import styles from "./Home.module.css";
import { ProjectService } from "../../services/ProjectServices";
import { TodoService } from "../../services/TodoServices";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function HomePage() {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const { requireAuth } = useAuthGuard();

  function handleCreateTodo() {
    requireAuth(() => setOpenTaskModal(true));
  }

  function handleCreateProject() {
    requireAuth(() => setOpenProjectModal(true));
  }

  return (
    <SidebarLayout>
      <div className={styles.container}>

        {/* Criar Tarefa */}
        <Card 
          title="Crie sua tarefa" 
          description="Gerencie suas tarefas de forma eficiente."
        >
          <button className={styles.Button} onClick={handleCreateTodo}>
            Criar Nova
          </button>

          <Modal
            open={openTaskModal}
            onClose={() => setOpenTaskModal(false)}
            Title="Criar nova tarefa"
            redirectTo="/todos"
            onSave={async (taskName) => {
              await TodoService.create({ title: taskName });
              setOpenTaskModal(false);
            }}
          />
        </Card>

        {/* Criar Projeto */}
        <Card 
          title="Crie seu projeto" 
          description="Organize seus projetos."
        >
          <button className={styles.Button} onClick={handleCreateProject}>
            Criar Novo Projeto
          </button>

          <Modal
            open={openProjectModal}
            onClose={() => setOpenProjectModal(false)}
            Title="Criar novo projeto"
            redirectTo="/projects"
            onSave={async (projectName) => {
              await ProjectService.create({ name: projectName });
              setOpenProjectModal(false);
            }}
          />
        </Card>

      </div>
    </SidebarLayout>
  );
}
git 