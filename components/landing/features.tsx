import { FileText, PenTool, MessageSquare, Search, ClipboardList, Zap, Shield, Clock } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "CV Optimization",
    description: "AI rewrites and tailors your CV to match specific job requirements, highlighting relevant skills.",
  },
  {
    icon: PenTool,
    title: "Cover Letter Generator",
    description: "Generate personalized, compelling cover letters in seconds that capture recruiter attention.",
  },
  {
    icon: MessageSquare,
    title: "Interview Preparation",
    description: "Get role-specific interview questions and suggested answers to ace your interviews.",
  },
  {
    icon: Search,
    title: "Job Discovery",
    description: "Find matching jobs from LinkedIn and other platforms based on your profile and preferences.",
  },
  {
    icon: ClipboardList,
    title: "Application Tracking",
    description: "Keep track of all your applications, deadlines, and follow-ups in one organized dashboard.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Paste any job link or description and get tailored results in under 30 seconds.",
  },
  {
    icon: Shield,
    title: "ATS-Optimized",
    description: "All generated content is optimized to pass Applicant Tracking Systems.",
  },
  {
    icon: Clock,
    title: "Save Hours",
    description: "What used to take hours now takes minutes. Focus on what matters - landing the job.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Everything you need to land your dream job</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to give you an unfair advantage in your job search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
