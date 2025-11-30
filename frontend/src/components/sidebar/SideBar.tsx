import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Sidebar.module.css";
import { User, Package, ChevronRight, Bolt, ListTodo } from "lucide-react";

import { useAuthGuard } from "../../hooks/useAuthGuard";
import { getUser } from "../../schemas/isLoggedSchemas";

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

  function handleNavigateToUsers() {
    requireAuth(() => {
      navigate("/users/me");
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
          <button className={styles.iconBtn} onClick={handleNavigateToUsers}>
            <div className={styles.userInfo}>
              <User />
              {!collapsed && (
                <div className={styles.userInfo}>
                  <span className={styles.toggleText}>{loggedUser?.name || "visitante"}</span>
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
