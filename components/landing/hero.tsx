import { Button } from "@/components/ui/button"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { ArrowRight, Play, Sparkles, FileText, MessageSquare, Search } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/30 rounded-full blur-[128px] opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <BadgeCustom variant="default" size="lg" className="mb-6">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI-Powered Job Assistant
          </BadgeCustom>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-balance">
            Land your dream job{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              faster with AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Fix your CV, generate cover letters, prepare for interviews, and discover opportunities. All powered by
            advanced AI that understands what recruiters want.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-base h-12 px-8">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base h-12 px-8 bg-transparent">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>10 free credits</span>
            </div>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-warning/50" />
              <div className="w-3 h-3 rounded-full bg-success/50" />
              <span className="ml-4 text-sm text-muted-foreground">FlowjobAI Dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground">CV Optimizer</h3>
                <p className="text-sm text-muted-foreground mt-1">AI-tailored resume for any job</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <MessageSquare className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Cover Letters</h3>
                <p className="text-sm text-muted-foreground mt-1">Generate compelling letters instantly</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <Search className="w-8 h-8 text-success mb-3" />
                <h3 className="font-semibold text-foreground">Job Discovery</h3>
                <p className="text-sm text-muted-foreground mt-1">Find matching opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
