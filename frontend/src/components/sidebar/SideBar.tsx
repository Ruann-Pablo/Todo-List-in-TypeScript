import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./Sidebar.module.css";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../schemas/isLoggedInSchemas";
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
  const { requireAuth } = useAuthGuard();
  const navigate = useNavigate();
  const loggedUser = getUser();

  function handleNavigateToTodos() {
    requireAuth(() => {
      navigate("/todos");
    });
  }

  function handleNavigateToProjects() {
    requireAuth(() => {
      navigate("/projects");
    });
  }

  return (
    <div className={styles.container}>
      <aside onClick={() => setCollapsed(!collapsed)}
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : styles.expanded}`}>
        <button className={styles.toggleButton} onClick={() => navigate('/')}>
          <Bolt />
          {!collapsed && <span className={`${styles.toggleText} ${styles.textTodo}`}>Todo-List</span>}
        </button>

        <nav className={styles.menuIcons}>
          <button className={styles.iconBtn} onClick={handleNavigateToTodos}>
            <ListTodo />{!collapsed && <span className={styles.toggleText}>Pendências</span>}
            </button>
          <button className={styles.iconBtn} onClick={handleNavigateToProjects}><Package />
            {!collapsed && <span className={styles.toggleText}>Projetos</span>}
          </button>
        </nav>

        <div className={styles.userArea}>
          <button className={styles.iconBtn}>
            <div className={styles.userInfo}>
              <User />
              {!collapsed && (
                <div className={styles.userInfo}>
                  <span className={styles.toggleText}>{loggedUser?.name}</span>
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
