"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { Upload, FileText, Sparkles, Download, Copy, Check, RefreshCw, ArrowRight } from "lucide-react"
import { useState } from "react"

export default function CVFixerPage() {
  const [step, setStep] = useState<"upload" | "input" | "result">("upload")
  const [jobDescription, setJobDescription] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">CV Fixer</h1>
        <p className="text-muted-foreground mt-1">
          Upload your CV and paste a job description to get AI-tailored suggestions
        </p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "upload" ? "bg-primary text-primary-foreground" : "bg-success text-success-foreground"}`}
          >
            {step !== "upload" ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <span className="text-sm font-medium text-foreground">Upload CV</span>
        </div>
        <div className="h-0.5 w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "input" ? "bg-primary text-primary-foreground" : step === "result" ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"}`}
          >
            {step === "result" ? <Check className="w-4 h-4" /> : "2"}
          </div>
          <span className={`text-sm font-medium ${step === "upload" ? "text-muted-foreground" : "text-foreground"}`}>
            Job Details
          </span>
        </div>
        <div className="h-0.5 w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "result" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
          >
            3
          </div>
          <span className={`text-sm font-medium ${step === "result" ? "text-foreground" : "text-muted-foreground"}`}>
            Results
          </span>
        </div>
      </div>

      {step === "upload" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-8 rounded-xl bg-card border border-border border-dashed hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload your CV</h3>
              <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports PDF, DOCX, TXT (Max 5MB)</p>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Paste CV content</h3>
              <p className="text-sm text-muted-foreground mb-4">Or paste your CV text directly</p>
              <Textarea placeholder="Paste your CV content here..." className="min-h-[120px] bg-secondary/50" />
            </div>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={() => setStep("input")} className="bg-primary hover:bg-primary/90 gap-2">
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "input" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <Label className="text-base font-semibold text-foreground">Job Description</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Paste the job posting or URL to tailor your CV</p>
            <Textarea
              placeholder="Paste the job description or link here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] bg-secondary/50"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep("upload")} className="bg-transparent">
              Back
            </Button>
            <Button onClick={() => setStep("result")} className="bg-primary hover:bg-primary/90 gap-2">
              <Sparkles className="w-4 h-4" />
              Analyze & Optimize
            </Button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">CV Optimized!</h3>
                  <p className="text-sm text-muted-foreground">Your CV score improved from 65 to 92</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-success">92</p>
                <p className="text-xs text-muted-foreground">Match Score</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Suggested Changes</h3>
                <BadgeCustom variant="success">12 improvements</BadgeCustom>
              </div>
              <div className="space-y-4">
                {[
                  { type: "add", text: 'Added "React" and "TypeScript" to skills section' },
                  { type: "improve", text: "Rephrased experience bullet points for impact" },
                  { type: "add", text: "Added relevant project highlighting state management" },
                  { type: "remove", text: "Removed outdated jQuery references" },
                  { type: "improve", text: "Optimized keywords for ATS compatibility" },
                ].map((change, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <BadgeCustom
                      variant={change.type === "add" ? "success" : change.type === "improve" ? "default" : "warning"}
                      size="sm"
                    >
                      {change.type}
                    </BadgeCustom>
                    <p className="text-sm text-muted-foreground">{change.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Optimized CV</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="bg-transparent gap-1.5">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent gap-1.5">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 h-80 overflow-y-auto">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                  {`JOHN DOE
Senior React Developer

SUMMARY
Experienced React developer with 5+ years building scalable web applications. Expert in TypeScript, state management, and modern frontend architectures.

SKILLS
• React, TypeScript, JavaScript (ES6+)
• Redux, React Query, Zustand
• Next.js, Node.js
• Jest, React Testing Library
• Git, CI/CD, Agile

EXPERIENCE

Senior Frontend Developer
Tech Corp | 2021 - Present
• Led development of customer-facing React application serving 1M+ users
• Implemented TypeScript migration reducing bugs by 40%
• Mentored 3 junior developers and conducted code reviews

...`}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep("input")} className="bg-transparent gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Another Job
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-transparent">
                Generate Cover Letter
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Prepare for Interview</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
