import { useState } from 'react';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Footer from '../components/admin/Footer';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#fafafa] selection:bg-orange-500/10 selection:text-orange-600">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Global Glow Layer */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto px-10 py-12 custom-scrollbar animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
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
