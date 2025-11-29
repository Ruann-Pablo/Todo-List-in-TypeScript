import type { ConfirmProps } from "../../types/componentsTypes/modal";

import styles from "./Modal.module.css";

export default function ConfirmModal({ open, title = "Confirm", message, onClose, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel", loading = false,}: ConfirmProps) {
  if (!open) return null;

  async function handleConfirm() {
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
      alert((err as any)?.message || "Error");
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{title}</h2>
        {message && <p style={{ marginTop: 8 }}>{message}</p>}

        <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "flex-end" }}>
          <button onClick={onClose} className={styles.cancel}>
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={styles.confirmDelete}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
