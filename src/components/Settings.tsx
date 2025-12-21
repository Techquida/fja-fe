// src/components/Settings.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { ArrowLeft, User, Bell, Shield, Trash2, LogOut } from "lucide-react";

import { auth } from "../lib/mockBackend";
import { toast } from "sonner";

export function Settings() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = auth.getCurrentUser();

  // Initialize form data once from current user
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    points: true,
    jobs: true,
    referrals: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;

    auth.updateUser(currentUser.id, formData);
    toast.success("Profile updated successfully! 🎉");
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Notification preferences updated");
  };

  const handleLogout = () => {
    auth.logout();
    toast.success("You have been signed out");
    navigate("/", { replace: true });
  };

  const handleBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-purple-100 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Manage Your Account
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Update your profile, preferences, and account settings
        </p>
      </div>

      {/* Profile Information */}
      <Card className="p-10 mb-10 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">Profile Information</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Label htmlFor="name" className="text-base">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 text-base"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 text-base"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 text-base"
            />
          </div>
        </div>

        <div className="mt-10">
          <Button size="lg" onClick={handleSaveProfile}>
            Save Profile Changes
          </Button>
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-10 mb-10 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Bell className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="font-medium text-lg">Email Notifications</p>
              <p className="text-gray-600">
                Receive important updates via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={() => handleNotificationToggle("email")}
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="font-medium text-lg">Points & Rewards</p>
              <p className="text-gray-600">
                Get notified when you earn or spend points
              </p>
            </div>
            <Switch
              checked={notifications.points}
              onCheckedChange={() => handleNotificationToggle("points")}
            />
          </div>

          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="font-medium text-lg">Job Recommendations</p>
              <p className="text-gray-600">Suggested jobs based on your CV</p>
            </div>
            <Switch
              checked={notifications.jobs}
              onCheckedChange={() => handleNotificationToggle("jobs")}
            />
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-lg">Referral Updates</p>
              <p className="text-gray-600">
                Know when friends join via your link
              </p>
            </div>
            <Switch
              checked={notifications.referrals}
              onCheckedChange={() => handleNotificationToggle("referrals")}
            />
          </div>
        </div>
      </Card>

      {/* Account Summary */}
      <Card className="p-10 mb-10 shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-7 h-7 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold">Account Overview</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-xl font-semibold">
              {new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Current Points Balance</p>
            <p className="text-3xl font-bold text-purple-600">
              {currentUser.points}
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Your Referral Code</p>
            <p className="text-2xl font-mono font-bold tracking-wider">
              {currentUser.referralCode}
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Daily Streak</p>
            <p className="text-3xl font-bold">
              {currentUser.streak} {currentUser.streak === 1 ? "day" : "days"}{" "}
              🔥
            </p>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-10 border-red-300 bg-red-50">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700">Danger Zone</h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-red-100 rounded-xl">
            <h3 className="font-semibold text-lg mb-2 text-red-800">
              Delete Your Account
            </h3>
            <p className="text-gray-700 mb-6">
              Permanently delete your account, all CVs, applications, and data.
              This action <strong>cannot be undone</strong>.
            </p>
            <Button variant="destructive" size="lg">
              Delete Account Permanently
            </Button>
          </div>

          <div className="p-6 bg-gray-100 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Sign Out</h3>
            <p className="text-gray-700 mb-6">
              Sign out of your ResumeGenie account on this device.
            </p>
            <Button variant="outline" size="lg" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
