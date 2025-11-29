import { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import { Input } from "../form/Input";
import CloseButton from "../buttons/CloseButton";
import { SubmitButton } from "../buttons/SubmitButton";
import { ProjectService } from "../../services/ProjectServices";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  initialName: string;
  initialDescription: string;
  onUpdated: () => void;
}

export default function EditProjectModal({
  open,
  onClose,
  projectId,
  initialName,
  initialDescription,
  onUpdated
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [open, initialName, initialDescription]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await ProjectService.update(projectId, {
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
            label="Nome do Projeto"
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
