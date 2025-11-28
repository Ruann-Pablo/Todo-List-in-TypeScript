import { useEffect, useState } from "react";
import styles from "./Modal.module.css";
import { Input } from "../form/Input";
import CloseButton from "../buttons/CloseButton";
import { SubmitButton } from "../buttons/SubmitButton";
import { ProjectService } from "../../services/ProjectServices";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  initialName?: string;
  initialDescription?: string;
  onUpdated?: () => void;
}

export default function EditProjectModal({
  open,
  onClose,
  projectId,
  initialName = "",
  initialDescription = "",
  onUpdated,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [open, initialName, initialDescription]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    setSaving(true);
    try {
      await ProjectService.update(projectId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      if (onUpdated) onUpdated();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Erro ao atualizar projeto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Projeto</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="project-name">Nome</label>
          <input
            id="project-name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do projeto"
          />

          <label className={styles.label} htmlFor="project-desc">Descrição</label>
          <textarea
            id="project-desc"
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do projeto (opcional)"
          />

          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <button onClick={onClose} className={styles.cancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
