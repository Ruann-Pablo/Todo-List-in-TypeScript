import { useState, useEffect } from "react";

import { TodoService } from "../../services/TodoServices";
import type { TodoDTO } from "../../types/todo";

import styles from "./Modal.module.css";

import Message from "../message/Message";
import CloseButton from "../buttons/CloseButton";

interface EditTodoProps {
  open: boolean;
  onClose: () => void;
  todo: TodoDTO;
  onUpdated: () => void;
}

export default function EditTodoModal({ open, onClose, todo, onUpdated }: EditTodoProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [saving, setSaving] = useState(false);

  // Resetar valores e mensagens ao abrir modal
  useEffect(() => {
    if (open) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setMessage("");
      setMessageType(null);
    }
  }, [open, todo]);

  if (!open) return null;

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;

    if (value.length > 110) {
      setMessageType("error");
      setMessage("A descrição pode ter no máximo 110 caracteres.");
      return;
    }

    setMessage("");
    setDescription(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    await TodoService.update(todo.id, {
      title,
      description,
    });

    setSaving(false);
    onUpdated();
    onClose();
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Editar Pendência</h2>

        <Message message={message} type={messageType ?? undefined} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />

          <label>Descrição</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className={styles.textarea}
          />

          <p className={styles.counter}>
            {description.length} / 110
          </p>

          <div className={styles.actions}>
            <button type="submit" disabled={saving} className={styles.saveButton}>
              {saving ? "Salvando..." : "Salvar"}
            </button>

            <CloseButton onClick={onClose}/>
          </div>
        </form>
      </div>
    </div>
  );
}
