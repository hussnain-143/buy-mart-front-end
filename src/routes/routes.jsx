import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Routes WITH Header + Footer */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Route>

      {/* Routes WITHOUT Header + Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
