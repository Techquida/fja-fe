import { Sparkles } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground">FlowjobAI</span>
          </Link>
          <h2 className="text-2xl font-semibold text-foreground text-center max-w-md">
            Land your dream job faster with AI-powered tools
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-6 max-w-md">
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-3xl font-bold text-primary">10k+</p>
              <p className="text-sm text-muted-foreground">Jobs Landed</p>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-3xl font-bold text-primary">50k+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-3xl font-bold text-primary">95%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border">
              <p className="text-3xl font-bold text-primary">4.9</p>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">FlowjobAI</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
