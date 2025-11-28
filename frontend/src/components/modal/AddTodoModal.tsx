import { useState } from "react";
import styles from "./Modal.module.css";
import { Input } from "../form/Input";
import CloseButton from "../buttons/CloseButton";
import { SubmitButton } from "../buttons/SubmitButton";
import { TodoService } from "../../services/TodoServices";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  onCreated: () => void;
}

export default function AddTodoModal({
  open,
  onClose,
  projectId,
  onCreated
}: Props) {
  const [title, setTitle] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    await TodoService.create({
      title,
      projectId 
    });

    setTitle("");
    onCreated(); 
    onClose();
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Criar nova pendência</h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            label="Título da pendência"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <SubmitButton>Criar</SubmitButton>
        </form>

        <CloseButton onClick={onClose} />
      </div>
    </div>
  );
}
