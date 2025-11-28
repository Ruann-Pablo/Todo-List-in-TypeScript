import { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import { Input } from "../form/Input";
import CloseButton from "../buttons/CloseButton";
import { SubmitButton } from "../buttons/SubmitButton";
import { ProjectService } from "../../services/ProjectServices";

interface Props {
  open: boolean;
  onClose: () => void;
  project: { id: number; name: string; description?: string };
  onUpdated: () => void;
}

export default function EditProjectModal({
  open,
  onClose,
  project,
  onUpdated
}: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  useEffect(() => {
    if (open) {
      setName(project.name);
      setDescription(project.description || "");
    }
  }, [open, project]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await ProjectService.update(project.id, {
      name,
      description
    });

    onUpdated();
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Editar Projeto</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="text"
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <SubmitButton>Salvar</SubmitButton>
        </form>

        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}
