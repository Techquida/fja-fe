"use client"

import { BadgeCustom } from "@/components/ui/badge-custom"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, Clock, DollarSign, Bookmark, ExternalLink } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  type: string
  postedAt: string
  source: string
  matchScore?: number
  saved?: boolean
  onSave?: () => void
}

export function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedAt,
  source,
  matchScore,
  saved,
  onSave,
}: JobCardProps) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCustom variant="secondary" size="sm">
              {source}
            </BadgeCustom>
            {matchScore && (
              <BadgeCustom variant="success" size="sm">
                {matchScore}% match
              </BadgeCustom>
            )}
          </div>
          <Link href={`/dashboard/jobs/${id}`} className="group">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {title}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              {company}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
            {salary && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                {salary}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onSave}
          className={`p-2 rounded-lg transition-colors ${saved ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground"}`}
        >
          <Bookmark className={`w-5 h-5 ${saved ? "fill-primary" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {postedAt}
          </div>
          <BadgeCustom variant="outline" size="sm">
            {type}
          </BadgeCustom>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <ExternalLink className="w-4 h-4 mr-1.5" />
            View
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
            <Link href={`/dashboard/cv-fixer?job=${id}`}>Apply with AI</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
