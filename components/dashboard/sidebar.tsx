"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  PenTool,
  MessageSquare,
  ClipboardList,
  CreditCard,
  Gift,
  Settings,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/dashboard/cv-fixer", icon: FileText, label: "CV Fixer" },
  { href: "/dashboard/cover-letter", icon: PenTool, label: "Cover Letter" },
  { href: "/dashboard/interview-prep", icon: MessageSquare, label: "Interview Prep" },
  { href: "/dashboard/applications", icon: ClipboardList, label: "Applications" },
  { href: "/dashboard/pricing", icon: CreditCard, label: "Buy Credits" },
  { href: "/dashboard/referral", icon: Gift, label: "Referrals" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-xl font-bold text-foreground">FlowjobAI</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors hidden lg:flex"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {!collapsed && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <p className="text-sm font-medium text-foreground">Pro Plan</p>
            <p className="text-xs text-muted-foreground mt-1">87 credits remaining</p>
            <div className="w-full h-2 bg-secondary rounded-full mt-2">
              <div className="w-[87%] h-full bg-primary rounded-full" />
            </div>
          </div>
        )}
        <button
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
