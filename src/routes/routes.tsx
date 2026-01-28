import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { lazy, Suspense } from "react";


const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Profile = lazy(() => import("../pages/Profile"));
const Loader = lazy(() => import("../components/common/Loader"));
const Vendor = lazy(() => import("../pages/Vendor"));
const Subscription = lazy(() => import("../pages/Subscription"));


const AppRoutes = () => {
  return (
    <Routes>

      {/* Routes WITH Header + Footer */}
      <Route element={<MainLayout />}>
        <Route index element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
        <Route path="/home" element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />
        <Route path="/subscription" element={<Suspense fallback={<Loader />}><Subscription /></Suspense>} />
        <Route path="/vendor-form" element={<Suspense fallback={<Loader />}><Vendor /></Suspense>} />
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
