import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;   
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
}
