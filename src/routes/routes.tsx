import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";


const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Profile = lazy(() => import("../pages/Profile"));
const Loader = lazy(() => import("../components/common/Loader"));
const Vendor = lazy(() => import("../pages/Vendor"));
const Subscription = lazy(() => import("../pages/Subscription"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Success = lazy(() => import("../pages/Success"));
const Cancel = lazy(() => import("../pages/Cancel"));

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminVendor = lazy(() => import("../pages/admin/AdminVendor"));

import MainLayout from "../layout/MainLayout";
import ProtectedRoutes from "./Auth/Protected.routes";
import AdminRoutes from "./Auth/Admin.routes";
import AdminLayout from "../layout/AdminLayout";


const AppRoutes = () => {
  return (
    <Routes>

      {/* Routes WITH Header + Footer */}
      <Route element={<MainLayout />}>
        <Route index element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
        <Route path="/home" element={<Suspense fallback={<Loader />}><Home /></Suspense>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/profile" element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />
          <Route path="/subscription" element={<Suspense fallback={<Loader />}><Subscription /></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<Loader />}><Checkout /></Suspense>} />
          <Route path="/success" element={<Suspense fallback={<Loader />}><Success /></Suspense>} />
          <Route path="/cancel" element={<Suspense fallback={<Loader />}><Cancel /></Suspense>} />
          <Route path="/vendor-form" element={<Suspense fallback={<Loader />}><Vendor /></Suspense>} />
        </Route>
      </Route>
      <Route element={<AdminLayout />}>
          <Route  path="/super" element={ <AdminRoutes />} >
            <Route path="dashboard" index element={ <Suspense fallback={<Loader/>}><Dashboard/></Suspense> } />
            <Route path="vendors" index element={ <Suspense fallback={<Loader/>}><AdminVendor/></Suspense> } />
          </Route>
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
