"use client"

import { JobCard } from "@/components/dashboard/job-card"
import { JobFilters } from "@/components/dashboard/job-filters"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Link2, Sparkles } from "lucide-react"
import { useState } from "react"

const sampleJobs = [
  {
    id: "1",
    title: "Senior React Developer",
    company: "Google",
    location: "Remote",
    salary: "$150k - $200k",
    type: "Full Time",
    postedAt: "2 hours ago",
    source: "LinkedIn",
    matchScore: 95,
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "Vercel",
    location: "San Francisco, CA",
    salary: "$130k - $180k",
    type: "Full Time",
    postedAt: "5 hours ago",
    source: "Company Site",
    matchScore: 88,
  },
  {
    id: "3",
    title: "Product Manager",
    company: "Stripe",
    location: "Remote",
    salary: "$140k - $190k",
    type: "Full Time",
    postedAt: "1 day ago",
    source: "LinkedIn",
    matchScore: 82,
  },
  {
    id: "4",
    title: "Frontend Engineer",
    company: "Meta",
    location: "New York, NY",
    salary: "$160k - $220k",
    type: "Full Time",
    postedAt: "2 days ago",
    source: "Indeed",
    matchScore: 79,
  },
  {
    id: "5",
    title: "Software Architect",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$180k - $250k",
    type: "Full Time",
    postedAt: "3 days ago",
    source: "LinkedIn",
    matchScore: 75,
  },
]

export default function JobsPage() {
  const [jobUrl, setJobUrl] = useState("")
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const toggleSave = (jobId: string) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
        <p className="text-muted-foreground mt-1">Discover and apply to jobs matching your profile</p>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Paste a job link or description</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get instant AI analysis and tailored application materials
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Textarea
                placeholder="Paste a job URL (e.g., LinkedIn, Indeed) or job description..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="flex-1 min-h-[60px] bg-background/50"
              />
              <Button className="bg-primary hover:bg-primary/90 gap-2 h-auto sm:h-[60px] px-6">
                <Sparkles className="w-4 h-4" />
                Analyze Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      <JobFilters />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{sampleJobs.length}</span> jobs
          </p>
          <Button variant="outline" size="sm" className="bg-transparent">
            Sort by: Best Match
          </Button>
        </div>

        <div className="space-y-4">
          {sampleJobs.map((job) => (
            <JobCard key={job.id} {...job} saved={savedJobs.includes(job.id)} onSave={() => toggleSave(job.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
