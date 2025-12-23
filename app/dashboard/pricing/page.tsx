"use client"

import { Button } from "@/components/ui/button"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { Check, Zap, Sparkles, Crown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const creditPacks = [
  { credits: 10, price: 5, popular: false },
  { credits: 50, price: 20, popular: true, savings: "20%" },
  { credits: 100, price: 35, popular: false, savings: "30%" },
  { credits: 250, price: 75, popular: false, savings: "40%" },
]

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Get started with FlowjobAI",
    credits: "10 credits",
    features: ["10 AI generations", "Basic CV analysis", "Email support", "7-day history"],
    icon: Zap,
    current: false,
  },
  {
    name: "Pro",
    price: 19,
    description: "Perfect for active job seekers",
    credits: "100 credits/month",
    features: [
      "100 AI generations/month",
      "Advanced CV optimization",
      "Unlimited cover letters",
      "Full interview prep",
      "Job discovery",
      "Application tracking",
      "Priority support",
      "Unlimited history",
    ],
    icon: Sparkles,
    current: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    description: "For teams and power users",
    credits: "Unlimited",
    features: [
      "Unlimited generations",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Analytics dashboard",
      "White-label options",
      "Custom training",
    ],
    icon: Crown,
    current: false,
  },
]

export default function PricingPage() {
  const [tab, setTab] = useState<"plans" | "credits">("plans")

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pricing & Credits</h1>
        <p className="text-muted-foreground mt-1">Upgrade your plan or purchase additional credits</p>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BadgeCustom variant="default">Pro Plan</BadgeCustom>
              <BadgeCustom variant="success">Active</BadgeCustom>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Your current plan</h3>
            <p className="text-muted-foreground mt-1">87 credits remaining • Renews Jan 15, 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">87</p>
              <p className="text-xs text-muted-foreground">credits left</p>
            </div>
            <div className="w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-secondary" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3"
                  strokeDasharray={`${87} ${100 - 87}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 rounded-lg bg-secondary/50 w-fit">
        <button
          onClick={() => setTab("plans")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            tab === "plans" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Subscription Plans
        </button>
        <button
          onClick={() => setTab("credits")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            tab === "credits" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Buy Credits
        </button>
      </div>

      {tab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative p-6 rounded-xl border transition-all",
                plan.popular
                  ? "bg-card border-primary shadow-xl shadow-primary/10"
                  : "bg-card border-border hover:border-primary/50",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <BadgeCustom variant="default">Most Popular</BadgeCustom>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <plan.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-sm text-primary mt-1">{plan.credits}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.current
                    ? "bg-secondary hover:bg-secondary/80"
                    : plan.popular
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-secondary hover:bg-secondary/80",
                )}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === "credits" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPacks.map((pack) => (
            <div
              key={pack.credits}
              className={cn(
                "relative p-6 rounded-xl border transition-all cursor-pointer",
                pack.popular
                  ? "bg-card border-primary shadow-lg shadow-primary/10"
                  : "bg-card border-border hover:border-primary/50",
              )}
            >
              {pack.popular && (
                <div className="absolute -top-2 right-4">
                  <BadgeCustom variant="default" size="sm">
                    Best Value
                  </BadgeCustom>
                </div>
              )}

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{pack.credits}</p>
                <p className="text-sm text-muted-foreground">credits</p>

                <div className="my-4">
                  <p className="text-2xl font-bold text-foreground">${pack.price}</p>
                  {pack.savings && <p className="text-xs text-success">Save {pack.savings}</p>}
                </div>

                <Button
                  className={cn(
                    "w-full",
                    pack.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80",
                  )}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
