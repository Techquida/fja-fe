"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Menu, Sparkles } from "lucide-react"
import { useState } from "react"

interface TopHeaderProps {
  onMenuClick?: () => void
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 lg:px-6 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search jobs, CVs, applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64 lg:w-80 h-10 bg-secondary/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="hidden sm:flex gap-2 bg-transparent">
          <Sparkles className="w-4 h-4" />
          <span>87 Credits</span>
        </Button>

        <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">JD</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">John Doe</p>
            <p className="text-xs text-muted-foreground">Pro Plan</p>
          </div>
        </div>
      </div>
    </header>
  )
}
