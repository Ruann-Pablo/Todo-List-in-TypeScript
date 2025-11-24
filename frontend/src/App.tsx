import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import TodosPage from "./pages/Todos/TodosPage";
import ProjectsPage from "./pages/Project/ProjectPage";
import UserPage from "./pages/User/UserPage";
import ProjectDetailsPage from "./pages/ProjectDetails/ProjectDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />

        {/* Rotas Privadas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
