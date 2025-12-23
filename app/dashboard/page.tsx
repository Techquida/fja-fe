import { StatCard } from "@/components/dashboard/stat-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Briefcase, FileText, Send, TrendingUp } from "lucide-react"

const stats = [
  { title: "Jobs Discovered", value: 128, change: "+12 this week", changeType: "positive" as const, icon: Briefcase },
  { title: "CVs Generated", value: 24, change: "+5 this week", changeType: "positive" as const, icon: FileText },
  { title: "Applications Sent", value: 18, change: "+3 this week", changeType: "positive" as const, icon: Send },
  {
    title: "Response Rate",
    value: "42%",
    change: "+8% vs last month",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const recentActivities = [
  {
    id: "1",
    type: "cv" as const,
    title: "CV optimized for Senior React Developer",
    description: "Tailored for Google position",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "cover-letter" as const,
    title: "Cover letter generated",
    description: "For Product Manager at Stripe",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "application" as const,
    title: "Application submitted",
    description: "Full Stack Engineer at Vercel",
    time: "3 hours ago",
  },
  {
    id: "4",
    type: "interview" as const,
    title: "Interview prep completed",
    description: "15 questions for Amazon",
    time: "Yesterday",
  },
  {
    id: "5",
    type: "cv" as const,
    title: "CV analyzed and scored",
    description: "Score: 87/100",
    time: "Yesterday",
  },
]

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
        <p className="text-muted-foreground mt-1">{"Here's what's happening with your job search"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <QuickActions />
        </div>
        <div>
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  )
}
