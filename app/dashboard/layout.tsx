"use client"

import type React from "react"

import { Sidebar } from "@/components/dashboard/sidebar"
import { TopHeader } from "@/components/dashboard/top-header"
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar className="hidden lg:flex" />
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
