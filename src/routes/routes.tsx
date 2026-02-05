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

const VendorDashboard = lazy(() => import("../pages/vendor/VendorDashboard"));
const SellerProducts = lazy(() => import("../pages/vendor/SellerProducts"));
const SellerOrders = lazy(() => import("../pages/vendor/SellerOrders"));
const SellerReviews = lazy(() => import("../pages/vendor/SellerReviews"));
const SellerAnalytics = lazy(() => import("../pages/vendor/SellerAnalytics"));
const SellerProfile = lazy(() => import("../pages/vendor/SellerProfile"));
const SellerSettings = lazy(() => import("../pages/vendor/SellerSettings"));

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminVendor = lazy(() => import("../pages/admin/AdminVendor"));
const AdminCategories = lazy(() => import("../pages/admin/AdminCategories"));
const AdminBrandRequests = lazy(() => import("../pages/admin/AdminBrandRequests"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const AdminOrderLogs = lazy(() => import("../pages/admin/AdminOrderLogs"));
const AdminProducts = lazy(() => import("../pages/admin/AdminProducts"));
const AdminReviews = lazy(() => import("../pages/admin/AdminReviews"));

import MainLayout from "../layout/MainLayout";
import ProtectedRoutes from "./Auth/Protected.routes";
import AdminRoutes from "./Auth/Admin.routes";
import VendorRoutes from "./Auth/Vendor.routes";
import AdminLayout from "../layout/AdminLayout";
import VendorLayout from "../layout/VendorLayout";


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
        <Route path="/super" element={<AdminRoutes />} >
          <Route path="dashboard" index element={<Suspense fallback={<Loader />}><Dashboard /></Suspense>} />
          <Route path="vendors" element={<Suspense fallback={<Loader />}><AdminVendor /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<Loader />}><AdminCategories /></Suspense>} />
          <Route path="brand-requests" element={<Suspense fallback={<Loader />}><AdminBrandRequests /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<Loader />}><AdminUsers /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<Loader />}><AdminOrders /></Suspense>} />
          <Route path="order-logs" element={<Suspense fallback={<Loader />}><AdminOrderLogs /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<Loader />}><AdminProducts /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<Loader />}><AdminReviews /></Suspense>} />
        </Route>
      </Route>

      <Route element={<VendorLayout />}>
        <Route path="/seller" element={<VendorRoutes />} >
          <Route path="dashboard" index element={<Suspense fallback={<Loader />}><VendorDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<Loader />}><SellerProducts /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<Loader />}><SellerOrders /></Suspense>} />
          <Route path="reviews" element={<Suspense fallback={<Loader />}><SellerReviews /></Suspense>} />
          <Route path="analytics" element={<Suspense fallback={<Loader />}><SellerAnalytics /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={<Loader />}><SellerProfile /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<Loader />}><SellerSettings /></Suspense>} />
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
