import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./Sidebar.module.css";
import {
  User,
  Package,
  ChevronRight,
  Bolt,
  ListTodo
} from "lucide-react";

interface SidebarLayoutProps {
  children: ReactNode;
} 

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={styles.container}>
      <aside onClick={() => setCollapsed(!collapsed)}
        className={`${styles.sidebar} ${
          collapsed ? styles.collapsed : styles.expanded
        }`}
      >
        <button className={styles.toggleButton}>
          <Bolt />
          {!collapsed && <span className={styles.toggleText}>Todo-List</span>}
        </button>

        <nav className={styles.menuIcons}>
          <button className={styles.iconBtn}>
            <ListTodo />{!collapsed && <span className={styles.toggleText}>Pendências</span>}
            </button>
          <button className={styles.iconBtn}><Package />
            {!collapsed && <span className={styles.toggleText}>Projetos</span>}
          </button>
        </nav>

        <div className={styles.userArea}>
          <button className={styles.iconBtn}>
            <div className={styles.userInfo}>
              <User />
              {!collapsed && (
                <div className={styles.userInfo}>
                  <span className={styles.toggleText}>Name User</span>
                </div>
              )}
            </div>
          </button>
          {!collapsed && <ChevronRight size={16} />}
        </div>
      </aside>
      <main>{children}</main>
    </div>
  );
}
