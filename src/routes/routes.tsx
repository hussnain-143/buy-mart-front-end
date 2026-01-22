import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Loader = lazy(() => import("../components/common/Loader"));


const AppRoutes = () => {
  return (
    <Routes>

      {/* Routes WITH Header + Footer */}
      <Route element={<MainLayout />}>
      <Suspense fallback={<Loader />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Suspense>
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
