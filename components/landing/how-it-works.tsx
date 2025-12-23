import { Link2, Sparkles, FileCheck, Send } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Paste Job Link",
    description: "Simply paste a job URL or description from LinkedIn, Indeed, or any job board.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Analysis",
    description: "Our AI analyzes the job requirements and matches them against your profile.",
  },
  {
    step: "03",
    icon: FileCheck,
    title: "Get Results",
    description: "Receive tailored CV updates, cover letter, and interview prep instantly.",
  },
  {
    step: "04",
    icon: Send,
    title: "Apply & Track",
    description: "Apply with confidence and track all your applications in one place.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How it Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From job listing to application in minutes, not hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
              <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-4xl font-bold text-border">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
