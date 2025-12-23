"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, Shield, CreditCard, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    jobAlerts: true,
    weeklyDigest: true,
    marketing: false,
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 flex md:flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="p-6 rounded-xl bg-card border border-border space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>

              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">JD</span>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="bg-transparent gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="John" className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Doe" className="bg-secondary/50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="john@example.com" type="email" className="bg-secondary/50" />
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input defaultValue="Senior React Developer" className="bg-secondary/50" />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  defaultValue="Experienced React developer passionate about building great user experiences."
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input defaultValue="https://linkedin.com/in/johndoe" className="bg-secondary/50" />
              </div>

              <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="p-6 rounded-xl bg-card border border-border space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>

              <div className="space-y-4">
                {[
                  {
                    key: "email",
                    title: "Email Notifications",
                    description: "Receive notifications via email",
                  },
                  { key: "push", title: "Push Notifications", description: "Receive browser push notifications" },
                  { key: "jobAlerts", title: "Job Alerts", description: "Get notified about new matching jobs" },
                  {
                    key: "weeklyDigest",
                    title: "Weekly Digest",
                    description: "Receive a weekly summary of your activity",
                  },
                  { key: "marketing", title: "Marketing Emails", description: "Receive tips, updates, and offers" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" className="bg-secondary/50" />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
                <p className="text-muted-foreground">Add an extra layer of security to your account</p>
                <Button variant="outline" className="bg-transparent">
                  Enable 2FA
                </Button>
              </div>

              <div className="p-6 rounded-xl bg-card border border-destructive/50 space-y-4">
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <p className="text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10">
                  <div>
                    <p className="font-semibold text-foreground">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">$19/month • Renews Jan 15, 2025</p>
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    Manage Plan
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Payment Method</h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/26</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Update
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Billing History</h3>
                  <Select defaultValue="2024">
                    <SelectTrigger className="w-24 bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  {[
                    { date: "Dec 15, 2024", amount: "$19.00", status: "Paid" },
                    { date: "Nov 15, 2024", amount: "$19.00", status: "Paid" },
                    { date: "Oct 15, 2024", amount: "$19.00", status: "Paid" },
                  ].map((invoice, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="font-medium text-foreground">{invoice.date}</p>
                        <p className="text-sm text-muted-foreground">Pro Plan - Monthly</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-foreground">{invoice.amount}</span>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
