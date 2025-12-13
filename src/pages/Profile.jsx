import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { User, Mail, LogOut, Settings, Bell, Shield } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold">
              {user?.displayName?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {user?.displayName || "User"}
            </h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg">
            <User className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="font-medium">{user?.displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-bg hover:bg-opacity-70 transition-all">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-400" size={20} />
              <span>Notifications</span>
            </div>
            <span className="text-sm text-gray-400">Enabled</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-dark-bg hover:bg-opacity-70 transition-all">
            <div className="flex items-center gap-3">
              <Shield className="text-gray-400" size={20} />
              <span>Privacy</span>
            </div>
            <span className="text-sm text-gray-400">Manage</span>
          </button>
        </div>
      </Card>

      {/* Sign Out Button */}
      <Button
        variant="danger"
        fullWidth
        size="lg"
        icon={LogOut}
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Profile;
