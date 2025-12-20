import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { ArrowLeft, User, Bell, Shield, Trash2 } from 'lucide-react';
import { auth } from '../lib/mockBackend';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

export function Settings({ onBack, onLogout }: SettingsProps) {
  const user = auth.getCurrentUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    points: true,
    jobs: true,
    referrals: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    if (user) {
      auth.updateUser(user.id, formData);
      toast.success('Settings saved successfully!');
    }
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
    toast.success('Notification preferences updated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              <span>Settings</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl mb-8">Account Settings</h1>

        {/* Profile Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+234 800 000 0000"
              />
            </div>

            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl">Notification Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p>Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p>Points Updates</p>
                <p className="text-sm text-gray-500">Get notified about point changes</p>
              </div>
              <Switch
                checked={notifications.points}
                onCheckedChange={() => handleNotificationToggle('points')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p>Job Recommendations</p>
                <p className="text-sm text-gray-500">Receive suggested job postings</p>
              </div>
              <Switch
                checked={notifications.jobs}
                onCheckedChange={() => handleNotificationToggle('jobs')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p>Referral Updates</p>
                <p className="text-sm text-gray-500">Notifications about your referrals</p>
              </div>
              <Switch
                checked={notifications.referrals}
                onCheckedChange={() => handleNotificationToggle('referrals')}
              />
            </div>
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p>{user && new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Points</p>
                <p className="text-2xl text-purple-600">{user?.points}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Referral Code</p>
                <p className="text-xl tracking-wide">{user?.referralCode}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-xl">{user?.streak} {user?.streak === 1 ? 'day' : 'days'} 🔥</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <div className="flex items-center gap-2 mb-6">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-xl text-red-600">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="mb-2">Delete Account</p>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="mb-2">Sign Out</p>
              <p className="text-sm text-gray-600 mb-4">
                Sign out of your account on this device.
              </p>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
