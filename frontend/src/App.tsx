import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import HomePage from "./pages/Home/HomePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
