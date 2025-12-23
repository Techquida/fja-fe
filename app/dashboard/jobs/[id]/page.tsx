import { BadgeCustom } from "@/components/ui/badge-custom"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  Share2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function JobDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </Link>

      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BadgeCustom variant="secondary">LinkedIn</BadgeCustom>
              <BadgeCustom variant="success">95% match</BadgeCustom>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Senior React Developer</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Google
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Remote
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                $150k - $200k
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Posted 2 hours ago
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-transparent">
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="bg-transparent gap-2">
              <ExternalLink className="w-4 h-4" />
              Original Post
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Job Description</h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-muted-foreground">
                We are looking for a Senior React Developer to join our team and help build the next generation of web
                applications. You will work closely with our product and design teams to deliver high-quality user
                experiences.
              </p>
              <h3 className="text-foreground mt-6 mb-3">Responsibilities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Develop and maintain responsive web applications using React</li>
                <li>Collaborate with cross-functional teams to define and implement features</li>
                <li>Write clean, maintainable, and well-tested code</li>
                <li>Participate in code reviews and mentor junior developers</li>
                <li>Contribute to architectural decisions and technical planning</li>
              </ul>
              <h3 className="text-foreground mt-6 mb-3">Requirements</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>5+ years of experience with React and modern JavaScript</li>
                <li>Strong understanding of state management patterns</li>
                <li>Experience with TypeScript and modern CSS</li>
                <li>Familiarity with testing frameworks like Jest and React Testing Library</li>
                <li>Excellent communication and collaboration skills</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Apply with AI</h3>
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 gap-2" asChild>
                <Link href="/dashboard/cv-fixer?job=1">
                  <Sparkles className="w-4 h-4" />
                  Optimize CV for this job
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/cover-letter?job=1">Generate Cover Letter</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/dashboard/interview-prep?job=1">Prepare for Interview</Link>
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Skills Match</h3>
            <div className="space-y-3">
              {["React", "TypeScript", "JavaScript", "CSS", "Git"].map((skill) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{skill}</span>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              ))}
              {["GraphQL", "AWS"].map((skill) => (
                <div key={skill} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{skill}</span>
                  <span className="text-xs text-warning">Learning</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
