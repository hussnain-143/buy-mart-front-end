import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-530px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
