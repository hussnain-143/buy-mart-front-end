import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Button from "./common/button";
import Toast from "./common/Toast";
import Loader from "./common/Loader";
import { GetUserProfile, UpdateProfile, UpdatePassword, UpdateAddress } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Edit2, Save, X, Lock } from "lucide-react";

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

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("Please login to view profile", "error");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }

        // Try to get from API first
        try {
          const res = await GetUserProfile();
          // Backend returns { data: { user: {...} } }
          const user = res.data?.user || res.data || res;
          setUserData(user);
          setProfileForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
          });
          // Get first address from array
          const firstAddress = user.address && user.address.length > 0 ? user.address[0] : null;
          setAddressForm({
            city: firstAddress?.city || "",
            street: firstAddress?.street || "",
            houseNo: firstAddress?.houseNo || "",
          });
          if (user.profileUrl) {
            setPreview(user.profileUrl);
          }
          // Update localStorage with fresh data from API (including address array)
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error: any) {
          // Check if token expired
          if (handleTokenExpiration(error)) {
            return;
          }
          
          // Fallback to localStorage
          const storedUser = localStorage.getItem("user");
          console.log(" [ Stored User ] :", storedUser);
          if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserData(user);
            setProfileForm({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              userName: user.userName,
            });
            // Get first address from array
            const firstAddress = user.address && user.address.length > 0 ? user.address[0] : null;
            setAddressForm({
              city: firstAddress?.city || "",
              street: firstAddress?.street || "",
              houseNo: firstAddress?.houseNo || "",
            });
            if (user.profileUrl) {
              setPreview(user.profileUrl);
            }
          }
        }
      } catch (error: any) {
        if (handleTokenExpiration(error)) {
          return;
        }
        showToast(error.message || "Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
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
      // Backend returns { data: { user: {...} } }
      const updatedUser = res.data?.user || res.data || res;

      // Update local state
      setUserData((prev) => ({ ...prev, ...updatedUser }));
      if (updatedUser.profileUrl) {
        setPreview(updatedUser.profileUrl);
      }

      // Update localStorage with complete user object
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({ ...user, ...updatedUser }));
      }

      setIsEditingProfile(false);
      showToast("Profile updated successfully!", "success");
    } catch (error: any) {
      if (handleTokenExpiration(error)) {
        return;
      }
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

    if (passwordForm.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      await UpdatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsEditingPassword(false);
      showToast("Password updated successfully!", "success");
    } catch (error: any) {
      if (handleTokenExpiration(error)) {
        return;
      }
      showToast(error.message || "Failed to update password", "error");
    }
  };

  // Submit Address Update
  const handleAddressSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Format address as array (backend expects address array)
      const addressData = {
        address: [{
          city: addressForm.city || "",
          street: addressForm.street || "",
          houseNo: addressForm.houseNo || "",
        }]
      };

      const res = await UpdateAddress(addressData);
      const updatedUser = res.data?.user || res.data || res;

      // Update local state - address comes back as array
      const updatedAddress = updatedUser.address || [];
      setUserData((prev) => ({ ...prev, address: updatedAddress }));

      // Update localStorage with the complete user object including address array
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({ 
          ...user, 
          address: updatedAddress 
        }));
      }

      // Update address form with first address
      const firstAddress = updatedAddress.length > 0 ? updatedAddress[0] : null;
      if (firstAddress) {
        setAddressForm({
          city: firstAddress.city || "",
          street: firstAddress.street || "",
          houseNo: firstAddress.houseNo || "",
        });
      }

      setIsEditingAddress(false);
      showToast("Address updated successfully!", "success");
    } catch (error: any) {
      if (handleTokenExpiration(error)) {
        return;
      }
      showToast(error.message || "Failed to update address", "error");
    }
  };

  // Cancel handlers
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
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    // Get first address from array
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
        <div className="text-secondary text-xl"><Loader/></div>
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
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary uppercase">
                    {fullName.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-secondary mb-2">{fullName}</h1>
              <p className="text-lg text-secondary/60 mb-4">@{displayName}</p>
              {userData.role && (
                <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
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
                content={
                  <>
                    <Edit2 size={18} className="mr-2 inline" />
                    Edit
                  </>
                }
                onClick={() => setIsEditingProfile(true)}
                style="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center text-sm"
              />
            )}
          </div>

          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  First Name
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName || ""}
                    onChange={handleProfileChange}
                    className="input"
                    placeholder="First Name"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.firstName || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  Last Name
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName || ""}
                    onChange={handleProfileChange}
                    className="input"
                    placeholder="Last Name"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.lastName || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  Email
                </label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email || ""}
                    onChange={handleProfileChange}
                    className="input"
                    placeholder="Email"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.email || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  Username
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="userName"
                    disabled
                    value={profileForm.userName || ""}
                    onChange={handleProfileChange}
                    className="input"
                    placeholder="Username"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.userName || "Not set"}
                  </p>
                )}
              </div>

              {isEditingProfile && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary/70 mb-2">
                    Profile Picture
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-3 px-4 py-2 rounded-xl border border-primary text-primary hover:bg-primary/10 transition">
                    <Edit2 size={18} />
                    Change Profile Picture
                    <input
                      type="file"
                      name="profile"
                      accept="image/*"
                      hidden
                      onChange={handleProfileChange}
                    />
                  </label>
                </div>
              )}
            </div>

            {isEditingProfile && (
              <div className="flex gap-4 justify-end mt-6">
                <Button
                  type="button"
                  content={
                    <>
                      <X size={18} className="mr-2 inline" />
                      Cancel
                    </>
                  }
                  onClick={handleCancelProfile}
                  style="px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition flex items-center"
                />
                <Button
                  type="submit"
                  content={
                    <>
                      <Save size={18} className="mr-2 inline" />
                      Save Changes
                    </>
                  }
                  style="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center"
                />
              </div>
            )}
          </form>
        </div>

        {/* Password Section */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Lock className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Password</h2>
            </div>
            {!isEditingPassword && (
              <Button
                content={
                  <>
                    <Edit2 size={18} className="mr-2 inline" />
                    Change Password
                  </>
                }
                onClick={() => setIsEditingPassword(true)}
                style="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center text-sm"
              />
            )}
          </div>

          <form onSubmit={handlePasswordSubmit}>
            {isEditingPassword ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary/70 mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    placeholder="Enter old password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary/70 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary/70 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
            ) : (
              <p className="text-secondary/60 py-3">••••••••</p>
            )}

            {isEditingPassword && (
              <div className="flex gap-4 justify-end mt-6">
                <Button
                  type="button"
                  content={
                    <>
                      <X size={18} className="mr-2 inline" />
                      Cancel
                    </>
                  }
                  onClick={handleCancelPassword}
                  style="px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition flex items-center"
                />
                <Button
                  type="submit"
                  content={
                    <>
                      <Save size={18} className="mr-2 inline" />
                      Update Password
                    </>
                  }
                  style="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center"
                />
              </div>
            )}
          </form>
        </div>

        {/* Address Information Section */}
        <div className="rounded-3xl bg-background/80 backdrop-blur-xl p-8 shadow-xl border border-white/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-secondary">Address Information</h2>
            </div>
            {!isEditingAddress && (
              <Button
                content={
                  <>
                    <Edit2 size={18} className="mr-2 inline" />
                    Edit
                  </>
                }
                onClick={() => setIsEditingAddress(true)}
                style="px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center text-sm"
              />
            )}
          </div>

          <form onSubmit={handleAddressSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  City
                </label>
                {isEditingAddress ? (
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city || ""}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="City"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.address && userData.address.length > 0 ? userData.address[0].city : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  Street
                </label>
                {isEditingAddress ? (
                  <input
                    type="text"
                    name="street"
                    value={addressForm.street || ""}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="Street"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.address && userData.address.length > 0 ? userData.address[0].street : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary/70 mb-2">
                  House No
                </label>
                {isEditingAddress ? (
                  <input
                    type="text"
                    name="houseNo"
                    value={addressForm.houseNo || ""}
                    onChange={handleAddressChange}
                    className="input"
                    placeholder="House No"
                  />
                ) : (
                  <p className="text-secondary font-medium py-3">
                    {userData.address && userData.address.length > 0 ? userData.address[0].houseNo : "Not set"}
                  </p>
                )}
              </div>
            </div>

            {isEditingAddress && (
              <div className="flex gap-4 justify-end mt-6">
                <Button
                  type="button"
                  content={
                    <>
                      <X size={18} className="mr-2 inline" />
                      Cancel
                    </>
                  }
                  onClick={handleCancelAddress}
                  style="px-6 py-3 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/10 transition flex items-center"
                />
                <Button
                  type="submit"
                  content={
                    <>
                      <Save size={18} className="mr-2 inline" />
                      Save Changes
                    </>
                  }
                  style="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition flex items-center"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainProfile;
