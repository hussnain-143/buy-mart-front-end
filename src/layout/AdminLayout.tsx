import { useState } from 'react';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0a] selection:bg-primary/20 selection:text-primary">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Global Glow Layer */}
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main Content */}
                <main className="flex-1 w-full min-w-0 overflow-y-auto px-6 md:px-10 py-12 pb-32 custom-scrollbar relative z-10">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default AdminLayout;
