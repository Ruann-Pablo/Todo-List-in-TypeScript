import React from "react";
import styles from "./Modal.module.css";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
};

export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
}: Props) {
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
          <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ccc", background: "transparent" }}>
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{ padding: "8px 14px", borderRadius: 8, background: "#c0392b", color: "#fff", border: "none" }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
