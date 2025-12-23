import { FileText, PenTool, MessageSquare, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Fix CV",
    description: "Tailor your resume for a specific job",
    href: "/dashboard/cv-fixer",
    icon: FileText,
    color: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    title: "Cover Letter",
    description: "Generate a compelling cover letter",
    href: "/dashboard/cover-letter",
    icon: PenTool,
    color: "from-accent/20 to-accent/5",
    iconColor: "text-accent",
  },
  {
    title: "Interview Prep",
    description: "Prepare for your upcoming interview",
    href: "/dashboard/interview-prep",
    icon: MessageSquare,
    color: "from-warning/20 to-warning/5",
    iconColor: "text-warning",
  },
  {
    title: "Find Jobs",
    description: "Discover matching opportunities",
    href: "/dashboard/jobs",
    icon: Search,
    color: "from-success/20 to-success/5",
    iconColor: "text-success",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="group p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
              <action.icon className={`w-6 h-6 ${action.iconColor}`} />
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-semibold text-foreground mt-4">{action.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
        </Link>
      ))}
    </div>
  )
}
