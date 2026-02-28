import { useState, useEffect } from "react";
import Header from "../components/vendor/Header";
import Sidebar from "../components/vendor/Sidebar";
import Footer from "../components/vendor/Footer";
import { Outlet } from "react-router-dom";
import {
  getVendorKey,
  setVendorKey as saveVendorKey,
} from "../services/vendor.service";

const VendorLayout = () => {
  const [vendorKey, setVendorKey] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [stripeId, setStripeId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendorKey = async () => {
      try {
        const res: any = await getVendorKey();

        const key = res?.data?.stripe_vendor_id || null;
        setVendorKey(key);

        if (!key) {
          setShowModal(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchVendorKey();
  }, []);

  const handleSubmitStripeId = async () => {
    if (!stripeId.trim()) return;

    try {
      setLoading(true);

      const res: any = await saveVendorKey({
        stripe_vendor_id: stripeId.trim(),
      });

      const savedKey = res?.data?.stripe_vendor_id || stripeId;

      setVendorKey(savedKey);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        <main className="flex-1 w-full min-w-0 overflow-y-auto px-10 py-12 pb-32 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* STRIPE ID MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Vendor Stripe Payment ID
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please enter your Stripe Payment ID to continue.
            </p>

            <input
              type="text"
              value={stripeId}
              onChange={(e) => setStripeId(e.target.value)}
              placeholder="Enter Stripe ID..."
              className="w-full mt-5 px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
            />

            <button
              onClick={handleSubmitStripeId}
              disabled={loading}
              className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorLayout;
