import type { TodoDTO } from "../../types/todo";

export interface ConfirmProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
};

export interface CreateProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskName: string) => Promise<void>;
  Title: string;
  redirectTo: string;
  initial?: {title: string}
}

export interface EditProjectProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
  initialName: string;
  initialDescription: string;
  onUpdated: () => void;
}

export interface EditTodoProps {
  open: boolean;
  onClose: () => void;
  todo: TodoDTO;
  onUpdated: () => void;
}

export type ProjectProps = {
  open: boolean;
  initial?: { name?: string; description?: string };
  title?: string;
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => Promise<void> | void;
};

export interface AddTodoProps {
  open: boolean;
  onClose: () => void;
  projectId?: number;
  onCreated: () => void;
}
