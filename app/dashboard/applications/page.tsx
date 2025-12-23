"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { Modal } from "@/components/ui/modal"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Filter, ExternalLink, Calendar, Building2 } from "lucide-react"
import { useState } from "react"

interface Application {
  id: string
  company: string
  position: string
  status: "applied" | "screening" | "interview" | "offer" | "rejected"
  appliedDate: string
  source: string
  notes?: string
}

const applications: Application[] = [
  {
    id: "1",
    company: "Google",
    position: "Senior React Developer",
    status: "interview",
    appliedDate: "2024-12-20",
    source: "LinkedIn",
    notes: "Phone screen scheduled for Dec 26",
  },
  {
    id: "2",
    company: "Vercel",
    position: "Full Stack Engineer",
    status: "screening",
    appliedDate: "2024-12-18",
    source: "Company Site",
  },
  {
    id: "3",
    company: "Stripe",
    position: "Product Manager",
    status: "applied",
    appliedDate: "2024-12-15",
    source: "LinkedIn",
  },
  {
    id: "4",
    company: "Meta",
    position: "Frontend Engineer",
    status: "offer",
    appliedDate: "2024-12-10",
    source: "Referral",
    notes: "Offer received: $180k base + equity",
  },
  {
    id: "5",
    company: "Amazon",
    position: "Software Architect",
    status: "rejected",
    appliedDate: "2024-12-05",
    source: "Indeed",
  },
  {
    id: "6",
    company: "Netflix",
    position: "UI Engineer",
    status: "interview",
    appliedDate: "2024-12-12",
    source: "LinkedIn",
    notes: "Final round next week",
  },
]

const statusColors = {
  applied: "secondary",
  screening: "default",
  interview: "warning",
  offer: "success",
  rejected: "destructive",
} as const

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const columns = [
    {
      key: "company",
      header: "Company",
      sortable: true,
      render: (row: Application) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{row.company}</p>
            <p className="text-xs text-muted-foreground">{row.source}</p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      header: "Position",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Application) => (
        <BadgeCustom variant={statusColors[row.status]} size="sm" className="capitalize">
          {row.status}
        </BadgeCustom>
      ),
    },
    {
      key: "appliedDate",
      header: "Applied",
      sortable: true,
      render: (row: Application) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {new Date(row.appliedDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: Application) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedApp(row)
              setIsModalOpen(true)
            }}
          >
            View
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredApps = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === "interview").length,
    offer: applications.filter((a) => a.status === "offer").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Application Tracker</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your job applications</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Application
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total Applications</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">In Interview</p>
          <p className="text-2xl font-bold text-warning mt-1">{stats.interview}</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-sm text-muted-foreground">Offers Received</p>
          <p className="text-2xl font-bold text-success mt-1">{stats.offer}</p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50"
            />
          </div>
          <Button variant="outline" className="bg-transparent gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredApps}
          onRowClick={(row) => {
            setSelectedApp(row)
            setIsModalOpen(true)
          }}
          emptyMessage="No applications found"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedApp(null)
        }}
        title={selectedApp ? `${selectedApp.position} at ${selectedApp.company}` : "Add New Application"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input defaultValue={selectedApp?.company} placeholder="Company name" className="bg-secondary/50" />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input defaultValue={selectedApp?.position} placeholder="Job title" className="bg-secondary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={selectedApp?.status || "applied"}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select defaultValue={selectedApp?.source || "linkedin"}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="company">Company Site</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea defaultValue={selectedApp?.notes} placeholder="Add notes..." className="bg-secondary/50" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setSelectedApp(null)
              }}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              {selectedApp ? "Save Changes" : "Add Application"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
