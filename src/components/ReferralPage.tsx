// src/components/ReferralPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Copy,
  Check,
  Mail,
  MessageCircle,
  Gift,
  Users,
  Award,
} from "lucide-react";

import { auth, referralService } from "../lib/mockBackend";
import { toast } from "sonner";
import type { Referral } from "../types";

export function ReferralPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);

  const user = auth.getCurrentUser();

  useEffect(() => {
    if (user) {
      const userReferrals = referralService.getReferrals(user.id);
      setReferrals(userReferrals);
      setTotalEarned(referralService.getTotalEarned(user.id));
    }
  }, [user]);

  const referralLink = `https://resumegenie.ng/signup?ref=${
    user?.referralCode || ""
  }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = "Join ResumeGenie and Get a Free Point!";
    const body = `Hi!\n\nI'm using ResumeGenie to optimize my CV and it's been amazing for my job search.\n\nSign up with my link and get 1 free point to try it:\n${referralLink}\n\nI'll also get 2 bonus points when you join. Let's both win! 🎉`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const shareViaWhatsApp = () => {
    const text = `Hey! I'm using ResumeGenie to fix my CV and get more interviews. It's awesome! 🙌\n\nJoin with my link and get 1 free point:\n${referralLink}\n\nI get 2 bonus points when you sign up. Win-win! 🚀`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const stats = [
    { icon: Users, label: "Total Referrals", value: referrals.length },
    { icon: Gift, label: "Points Earned", value: totalEarned },
    {
      icon: Award,
      label: "Pending",
      value: referrals.filter((r) => r.status !== "completed").length,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Invite Friends & Earn Free Points
        </h1>
        <p className="text-xl text-gray-600">
          Get <strong>2 points</strong> every time someone signs up with your
          link
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-8 text-center">
              <Icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <p className="text-gray-700 text-lg">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Referral Link */}
      <Card className="p-10 mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">
          Your Referral Link
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input value={referralLink} readOnly className="font-mono" />
          <Button size="lg" onClick={handleCopy}>
            {copied ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <Copy className="w-5 h-5 mr-2" />
            )}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">Quick share:</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={shareViaEmail}>
              <Mail className="w-5 h-5 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="lg" onClick={shareViaWhatsApp}>
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </Card>

      {/* Referral Code */}
      <Card className="p-10 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="text-center">
          <p className="mb-4 opacity-90">Your Referral Code</p>
          <div className="text-5xl font-bold tracking-widest mb-4">
            {user?.referralCode}
          </div>
          <p className="opacity-90">Friends can enter this during signup</p>
        </div>
      </Card>

      {/* History */}
      <Card className="p-10">
        <h2 className="text-2xl font-bold mb-6">Referral History</h2>
        {referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{r.referredEmail}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant={r.status === "completed" ? "default" : "secondary"}
                >
                  {r.status === "completed"
                    ? `+${r.pointsEarned} points`
                    : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">No referrals yet</p>
            <p className="text-gray-500">Share your link and start earning!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
