import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Button from "./common/button";
import Toast from "./common/Toast";
import Loader from "./common/Loader";
import { GetUserProfile, UpdateProfile, UpdatePassword, UpdateAddress } from "../services/auth.service";
import { GetUserOrders } from "../services/order.service";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Edit2, Save, X, Lock, Package, Clock, CheckCircle } from "lucide-react";

type AddressItem = {
  city: string;
  street: string;
  houseNo: string;
  _id?: string;
};

type UserData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  profileUrl?: string;
  address?: AddressItem[];
  role?: string;
};

type ProfileFormData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  profile?: File | null;
};

type PasswordFormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type AddressFormData = {
  city?: string;
  street?: string;
  houseNo?: string;
};

const MainProfile = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  // Edit states for each section
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [userData, setUserData] = useState<UserData>({});
  const [profileForm, setProfileForm] = useState<ProfileFormData>({});
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [addressForm, setAddressForm] = useState<AddressFormData>({});

  const showToast = (message: string, type = "info", duration = 3000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), duration);
  };

  // Helper function to handle token expiration
  const handleTokenExpiration = (error: any) => {
    if (error.isTokenExpired ||
      error.message?.toLowerCase().includes("token expired") ||
      error.message?.toLowerCase().includes("access token expired")) {
      showToast("Your session has expired. Please login again.", "error");
      setTimeout(() => navigate("/login"), 1500);
      return true;
    }
    return false;
  };

  // Load user data and orders
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("Please login to view profile", "error");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        // Try to get Profile
        try {
          const profileRes = await GetUserProfile();
          const user = profileRes.data?.user || profileRes.data || profileRes;
          setUserData(user);
          setProfileForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
          });
          const firstAddress = user.address && user.address.length > 0 ? user.address[0] : null;
          setAddressForm({
            city: firstAddress?.city || "",
            street: firstAddress?.street || "",
            houseNo: firstAddress?.houseNo || "",
          });
          if (user.profileUrl) setPreview(user.profileUrl);
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error: any) {
          if (handleTokenExpiration(error)) return;
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
          }
        }

        // Load Orders
        setOrdersLoading(true);
        try {
          const ordersRes = await GetUserOrders();
          setOrders(ordersRes.data || []);
        } catch (error: any) {
          console.error("Failed to load orders:", error);
        } finally {
          setOrdersLoading(false);
        }

      } catch (error: any) {
        if (handleTokenExpiration(error)) return;
        showToast(error.message || "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Handle profile form changes
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profile") {
      const file = files?.[0];
      if (file) {
        setProfileForm((prev) => ({ ...prev, profile: file }));
        setPreview(URL.createObjectURL(file));
      }
      return;
    }

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle address form changes
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Profile Update
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      if (profileForm.firstName) formDataToSend.append("firstName", profileForm.firstName);
      if (profileForm.lastName) formDataToSend.append("lastName", profileForm.lastName);
      if (profileForm.email) formDataToSend.append("email", profileForm.email);
      if (profileForm.profile) formDataToSend.append("profile", profileForm.profile);

      const res = await UpdateProfile(formDataToSend, true);
      const updatedUser = res.data?.user || res.data || res;
      setUserData((prev) => ({ ...prev, ...updatedUser }));
      if (updatedUser.profileUrl) setPreview(updatedUser.profileUrl);

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
      }

      setIsEditingProfile(false);
      showToast("Profile updated successfully!", "success");
    } catch (error: any) {
      if (handleTokenExpiration(error)) return;
      showToast(error.message || "Failed to update profile", "error");
    }
  };

  // Submit Password Update
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    try {
      await UpdatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setIsEditingPassword(false);
      showToast("Password updated successfully!", "success");
    } catch (error: any) {
      if (handleTokenExpiration(error)) return;
      showToast(error.message || "Failed to update password", "error");
    }
  };

  // Submit Address Update
  const handleAddressSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const addressData = {
        address: [{
          city: addressForm.city || "",
          street: addressForm.street || "",
          houseNo: addressForm.houseNo || "",
        }]
      };
      const res = await UpdateAddress(addressData);
      const updatedUser = res.data?.user || res.data || res;
      const updatedAddress = updatedUser.address || [];
      setUserData((prev) => ({ ...prev, address: updatedAddress }));

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({ ...user, address: updatedAddress }));
      }

      setIsEditingAddress(false);
      showToast("Address updated successfully!", "success");
    } catch (error: any) {
      if (handleTokenExpiration(error)) return;
      showToast(error.message || "Failed to update address", "error");
    }
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    setProfileForm({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userName: userData.userName,
    });
    setPreview(userData.profileUrl || null);
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    const firstAddress = userData.address && userData.address.length > 0 ? userData.address[0] : null;
    setAddressForm({
      city: firstAddress?.city || "",
      street: firstAddress?.street || "",
      houseNo: firstAddress?.houseNo || "",
    });
  };

  if (loading) {
    return (
      <div className="font-[var(--font-montserrat)] min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-accent/20">
        <Loader />
      </div>
    );
  }

  const fullName = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "User";
  const displayName = userData.userName || fullName;

  return (
    <div className="font-[var(--font-montserrat)] min-h-screen w-full bg-gradient-to-br from-primary/10 via-white to-accent/20 py-12 px-4">
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="mx-auto max-w-4xl">
        {/* Header Card */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary uppercase">{fullName.charAt(0)}</span>
                ) || <User size={48} className="text-primary" />}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-secondary mb-2">{fullName}</h1>
              <p className="text-lg text-secondary/60 mb-4">@{displayName}</p>
              {userData.role && (
                <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold uppercase tracking-wider">
                  {userData.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Profile Information</h2>
            </div>
            {!isEditingProfile && (
              <Button
                content={<><Edit2 size={18} className="mr-2 inline" />Edit</>}
                onClick={() => setIsEditingProfile(true)}
                style="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center text-sm"
              />
            )}
          </div>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">First Name</label>
                {isEditingProfile ? (
                  <input type="text" name="firstName" value={profileForm.firstName || ""} onChange={handleProfileChange} className="input" placeholder="First Name" />
                ) : (
                  <p className="text-secondary font-medium py-3">{userData.firstName || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">Last Name</label>
                {isEditingProfile ? (
                  <input type="text" name="lastName" value={profileForm.lastName || ""} onChange={handleProfileChange} className="input" placeholder="Last Name" />
                ) : (
                  <p className="text-secondary font-medium py-3">{userData.lastName || "Not set"}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary/70 mb-2">Email</label>
                {isEditingProfile ? (
                  <input type="email" name="email" value={profileForm.email || ""} onChange={handleProfileChange} className="input" placeholder="Email" />
                ) : (
                  <p className="text-secondary font-medium py-3">{userData.email || "Not set"}</p>
                )}
              </div>
            </div>
            {isEditingProfile && (
              <div className="flex gap-4 justify-end mt-6">
                <Button type="button" content={<><X size={18} className="mr-2 inline" />Cancel</>} onClick={handleCancelProfile} style="px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition flex items-center" />
                <Button type="submit" content={<><Save size={18} className="mr-2 inline" />Save Changes</>} style="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center" />
              </div>
            )}
          </form>
        </div>

        {/* Order History Section */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-secondary">Order History</h2>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center p-8"><Loader /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <Package size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No orders found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="p-4 rounded-2xl bg-white/50 border border-white/60 hover:shadow-md transition group">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-secondary">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-secondary/60 flex items-center gap-1">
                          <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-secondary text-lg">${order.total_amount?.toFixed(2)}</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-orange-100 text-orange-600'
                        }`}>
                        {order.status === 'Completed' && <CheckCircle size={10} />}
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Password Settings</h2>
            </div>
            {!isEditingPassword && (
              <Button content={<><Edit2 size={18} className="mr-2 inline" />Change</>} onClick={() => setIsEditingPassword(true)} style="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center text-sm" />
            )}
          </div>
          <form onSubmit={handlePasswordSubmit}>
            {isEditingPassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="password" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} className="input" placeholder="Current Password" required />
                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="input" placeholder="New Password" required />
                <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="input" placeholder="Confirm New Password" required />
              </div>
            )}
            {isEditingPassword && (
              <div className="flex gap-4 justify-end mt-6">
                <Button type="button" content={<><X size={18} className="mr-2 inline" />Cancel</>} onClick={handleCancelPassword} style="px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition flex items-center" />
                <Button type="submit" content={<><Save size={18} className="mr-2 inline" />Update</>} style="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center" />
              </div>
            )}
          </form>
        </div>

        {/* Address Information Section */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Delivery Address</h2>
            </div>
            {!isEditingAddress && (
              <Button content={<><Edit2 size={18} className="mr-2 inline" />Edit</>} onClick={() => setIsEditingAddress(true)} style="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center text-sm" />
            )}
          </div>
          <form onSubmit={handleAddressSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">City</label>
                {isEditingAddress ? (
                  <input type="text" name="city" value={addressForm.city || ""} onChange={handleAddressChange} className="input" placeholder="City" />
                ) : (
                  <p className="text-secondary font-medium py-3">{userData.address?.[0]?.city || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">Street</label>
                {isEditingAddress ? (
                  <input type="text" name="street" value={addressForm.street || ""} onChange={handleAddressChange} className="input" placeholder="Street" />
                ) : (
                  <p className="text-secondary font-medium py-3">{userData.address?.[0]?.street || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">House No</label>
                {isEditingAddress ? (
                  <input type="text" name="houseNo" value={addressForm.houseNo || ""} onChange={handleAddressChange} className="input" placeholder="House No" />
                ) : (
                  <p className="text-secondary font-medium py-3">{userData.address?.[0]?.houseNo || "Not set"}</p>
                )}
              </div>
            </div>
            {isEditingAddress && (
              <div className="flex gap-4 justify-end mt-6">
                <Button type="button" content={<><X size={18} className="mr-2 inline" />Cancel</>} onClick={handleCancelAddress} style="px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition flex items-center" />
                <Button type="submit" content={<><Save size={18} className="mr-2 inline" />Save Address</>} style="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center" />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainProfile;
