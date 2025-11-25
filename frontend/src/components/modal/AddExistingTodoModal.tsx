import React, { useEffect, useState } from "react";
import styles from "./AddExistingTodoModal.module.css";
import { TodoService, type TodoDTO } from "../../services/TodoServices";

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  onAdded: () => void;
}

export default function AddExistingTodoModal({ open, onClose, projectId, onAdded }: Props) {
  const [todos, setTodos] = useState<TodoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTodos() {
    setLoading(true);
    const data = await TodoService.getAll();

    // Apenas pendências sem vínculo com projeto
    setTodos(data.filter((t) => !t.projectId));
    setLoading(false);
  }

  useEffect(() => {
    if (open) loadTodos();
  }, [open]);

  async function attach(todoId: number) {
    await TodoService.update(todoId, { projectId });
    onAdded();
    onClose();
  }

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Adicionar pendência existente</h3>

        {loading ? (
          <p>Carregando...</p>
        ) : todos.length === 0 ? (
          <p>Nenhuma pendência disponível.</p>
        ) : (
          <ul className={styles.list}>
            {todos.map((t) => (
              <li key={t.id} className={styles.item}>
                <span>{t.title}</span>
                <button className={styles.addBtn} onClick={() => attach(t.id)}>
                  Adicionar
                </button>
              </li>
            ))}
          </ul>
        )}

        <button className={styles.closeBtn} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
