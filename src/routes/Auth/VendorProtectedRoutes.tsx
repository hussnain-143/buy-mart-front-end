import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// ================= TYPES =================
type UserType = {
    vendor_subscription?: SubscriptionStatus;
};

type SubscriptionStatus = {
    status: "active" | "inactive" | "canceled";
};

const VendorProtectedRoutes = () => {
    const [loading, setLoading] = useState(true);
    const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);

    useEffect(() => {
        const checkSubscription = () => {
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
                try {
                    const parsedUser: UserType = JSON.parse(storedUser);
                    setSubStatus(parsedUser.vendor_subscription || null);
                } catch (e) {
                    console.error("Failed to parse user data", e);
                    setSubStatus(null);
                }
            } else {
                setSubStatus(null);
            }
            setLoading(false);
        };

        checkSubscription();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or your Loader component
    }

    // Check if subscription is active
    if (subStatus?.status === 'active') {
        return <Outlet />;
    }

    // Redirect if not active
    return <Navigate to="/subscription" replace />;
};

export default VendorProtectedRoutes;
