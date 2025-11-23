import { useNavigate } from "react-router-dom";
import { isLoggedInSchemas } from "../schemas/isLoggedInSchemas"; // ou onde estiver

export function useAuthGuard() {
  const navigate = useNavigate();

  function requireAuth(action: () => void) {
    if (!isLoggedInSchemas()) {
      navigate("/users/login");
      return;
    }

    action(); // executa ação protegida
  }

  return { requireAuth };
}
