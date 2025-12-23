"use client"

import { Button } from "@/components/ui/button"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out FlowjobAI",
    price: { monthly: 0, yearly: 0 },
    credits: "10 credits",
    features: ["10 AI generations", "Basic CV analysis", "1 cover letter", "5 interview questions", "Email support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    description: "Best for active job seekers",
    price: { monthly: 19, yearly: 190 },
    credits: "100 credits/mo",
    features: [
      "100 AI generations/month",
      "Advanced CV optimization",
      "Unlimited cover letters",
      "Full interview prep",
      "Job discovery",
      "Application tracking",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and recruiters",
    price: { monthly: 99, yearly: 990 },
    credits: "Unlimited",
    features: [
      "Unlimited generations",
      "Team collaboration",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "Analytics dashboard",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your job search needs
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={cn("text-sm", !annual && "text-foreground font-medium")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn("relative w-14 h-7 rounded-full transition-colors", annual ? "bg-primary" : "bg-secondary")}
            >
              <span
                className={cn(
                  "absolute top-1 w-5 h-5 rounded-full bg-foreground transition-transform",
                  annual ? "translate-x-8" : "translate-x-1",
                )}
              />
            </button>
            <span className={cn("text-sm", annual && "text-foreground font-medium")}>
              Yearly
              <BadgeCustom variant="success" size="sm" className="ml-2">
                Save 20%
              </BadgeCustom>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative p-8 rounded-xl border transition-all",
                plan.popular
                  ? "bg-card border-primary shadow-xl shadow-primary/10"
                  : "bg-card border-border hover:border-primary/50",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <BadgeCustom variant="default" size="md">
                    Most Popular
                  </BadgeCustom>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ${annual ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground">/{annual ? "year" : "month"}</span>
                  )}
                </div>
                <p className="text-sm text-primary mt-1">{plan.credits}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full",
                  plan.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80",
                )}
                asChild
              >
                <Link href="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
