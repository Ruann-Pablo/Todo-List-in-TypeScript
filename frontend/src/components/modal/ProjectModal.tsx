import React, { useEffect, useState } from "react";
import styles from "./Modal.module.css";
import { Input } from "../form/Input";
import { SubmitButton } from "../form/SubmitButton";

type Props = {
  open: boolean;
  initial?: { name?: string; description?: string };
  title?: string;
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => Promise<void> | void;
};

export default function ProjectModal({ open, initial, title = "Project", onClose, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
    } else {
      // when open, set current initial values (useful for edit)
      setName(initial?.name ?? "");
      setDescription(initial?.description ?? "");
    }
  }, [open, initial]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim() || undefined });
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as any)?.message || "Error saving project");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            id="project-name"
            label="Título"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            id="project-desc"
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <SubmitButton disabled={saving}>{saving ? "Saving..." : "Salvar"}</SubmitButton>
        </form>

        <button className={styles.closeBtn} onClick={onClose} aria-label="close">×</button>
      </div>
    </div>
  );
}
