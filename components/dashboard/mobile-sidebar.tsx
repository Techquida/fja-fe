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
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 lg:hidden transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">FlowjobAI</span>
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <p className="text-sm font-medium text-foreground">Pro Plan</p>
            <p className="text-xs text-muted-foreground mt-1">87 credits remaining</p>
            <div className="w-full h-2 bg-secondary rounded-full mt-2">
              <div className="w-[87%] h-full bg-primary rounded-full" />
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
