import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Authenticated from "./Authenticated";


const Router = () => (
  <Routes>
    <Route path="/" element={<Authenticated><HomePage /></Authenticated>} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default Router;