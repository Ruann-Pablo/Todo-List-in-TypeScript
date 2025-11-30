import { useNavigate } from "react-router-dom";
import { isLoggedInSchemas } from "../schemas/isLoggedSchemas"; 

export function useAuthGuard() {
  const navigate = useNavigate();

  function requireAuth(action: () => void) {
    if (!isLoggedInSchemas()) {
      navigate("/users/login");
      return; 
    }

    action(); 
  }

  return { requireAuth };
}
