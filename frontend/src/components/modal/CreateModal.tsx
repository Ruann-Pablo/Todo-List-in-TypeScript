import { useEffect, useState } from "react";
import styles from "./Modal.module.css";
import { Input } from "../form/Input";
import CloseButton from "../buttons/CloseButton";
import { useNavigate } from "react-router-dom";
import { SubmitButton } from "../buttons/SubmitButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskName: string) => Promise<void>;
  Title: string;
  redirectTo: string;
  initial?: {title: string}
}

export default function Modal({ open, onClose, onSave, Title, redirectTo }: ModalProps) {
  const [taskName, setTaskName] = useState("");
  const navigate = useNavigate();

  const isDisabled = taskName.trim().length === 0;

  useEffect(() => {
    if (!open) setTaskName("");
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isDisabled) return;

    await onSave(taskName);   
    navigate(redirectTo);     
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{Title}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            value={taskName}
            onChange={(e: any) => setTaskName(e.target.value)}
          />

          <SubmitButton>Criar</SubmitButton>
        </form>

        <CloseButton onClick={onClose}/>
      </div>
    </div>
  );
}
