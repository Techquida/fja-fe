"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { Copy, Check, Gift, Users, Zap, Share2 } from "lucide-react"
import { useState } from "react"

const referralHistory = [
  { name: "Sarah M.", date: "Dec 20, 2024", status: "active", credits: 10 },
  { name: "Alex K.", date: "Dec 15, 2024", status: "active", credits: 10 },
  { name: "Mike R.", date: "Dec 10, 2024", status: "pending", credits: 0 },
  { name: "Emma S.", date: "Dec 5, 2024", status: "active", credits: 10 },
]

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "FLOWJOB-JOHN2024"
  const referralLink = "https://flowjobai.com/ref/JOHN2024"

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Referral Program</h1>
        <p className="text-muted-foreground mt-1">Invite friends and earn free credits</p>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-success/10 border border-primary/20">
        <div className="text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Give 10 Credits, Get 10 Credits</h2>
          <p className="text-muted-foreground">
            Share FlowjobAI with friends. They get 10 free credits when they sign up, and you earn 10 credits when they
            become active users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border text-center">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">12</p>
          <p className="text-sm text-muted-foreground">Friends Invited</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border text-center">
          <Check className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-sm text-muted-foreground">Successful Referrals</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border text-center">
          <Zap className="w-8 h-8 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">80</p>
          <p className="text-sm text-muted-foreground">Credits Earned</p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Referral Link</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input value={referralLink} readOnly className="bg-secondary/50 font-mono text-sm" />
            <Button
              onClick={() => handleCopy(referralLink)}
              variant="outline"
              className="bg-transparent gap-2 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Your code:</span>
            <code className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-mono text-foreground">
              {referralCode}
            </code>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" className="bg-transparent gap-2">
              <Share2 className="w-4 h-4" />
              Share on Twitter
            </Button>
            <Button variant="outline" className="bg-transparent gap-2">
              <Share2 className="w-4 h-4" />
              Share on LinkedIn
            </Button>
            <Button variant="outline" className="bg-transparent gap-2">
              <Share2 className="w-4 h-4" />
              Email Friends
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Referral History</h3>
        <div className="space-y-3">
          {referralHistory.map((ref, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">{ref.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{ref.name}</p>
                  <p className="text-xs text-muted-foreground">Joined {ref.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCustom variant={ref.status === "active" ? "success" : "warning"} size="sm">
                  {ref.status}
                </BadgeCustom>
                {ref.credits > 0 && <span className="text-sm font-medium text-success">+{ref.credits} credits</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
