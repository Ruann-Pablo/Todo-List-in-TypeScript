import { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import { TodoService, type TodoDTO } from "../../services/TodoServices";
import Message from "../message/Message";

interface Props {
  open: boolean;
  onClose: () => void;
  todo: TodoDTO;
  onUpdated: () => void;
}

export default function EditTodoModal({ open, onClose, todo, onUpdated }: Props) {
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

    if (description.length > 110) {
      setMessage("A descrição ultrapassou o limite de 110 caracteres.");
      setMessageType("error");
      return;
    }

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
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancelar
            </button>

            <button type="submit" disabled={saving} className={styles.saveBtn}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
