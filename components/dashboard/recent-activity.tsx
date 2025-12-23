import { FileText, PenTool, Send, MessageSquare } from "lucide-react"

interface Activity {
  id: string
  type: "cv" | "cover-letter" | "application" | "interview"
  title: string
  description: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const activityIcons = {
  cv: FileText,
  "cover-letter": PenTool,
  application: Send,
  interview: MessageSquare,
}

const activityColors = {
  cv: "text-primary",
  "cover-letter": "text-accent",
  application: "text-success",
  interview: "text-warning",
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-xl bg-card border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type]
          return (
            <div key={activity.id} className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon className={`w-5 h-5 ${activityColors[activity.type]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
              </div>
              <p className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
