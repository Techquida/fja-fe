"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Copy, Download, RefreshCw, Check, PenTool } from "lucide-react"
import { useState } from "react"

export default function CoverLetterPage() {
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tone, setTone] = useState("professional")
  const [jobDescription, setJobDescription] = useState("")

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sampleCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior React Developer position at Google. With over 5 years of experience building scalable web applications and a passion for creating exceptional user experiences, I am confident I would be a valuable addition to your team.

In my current role at Tech Corp, I have led the development of customer-facing React applications serving over 1 million users. I spearheaded a TypeScript migration that reduced bugs by 40% and improved team productivity. My experience with state management solutions like Redux and React Query, combined with my commitment to writing clean, maintainable code, aligns perfectly with the requirements outlined in your job posting.

What excites me most about this opportunity is Google's commitment to innovation and its impact on millions of users worldwide. I am particularly drawn to the chance to work on products that shape how people interact with technology daily.

I would welcome the opportunity to discuss how my skills and experience can contribute to Google's continued success. Thank you for considering my application.

Best regards,
John Doe`

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cover Letter Generator</h1>
        <p className="text-muted-foreground mt-1">Generate compelling, personalized cover letters in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Job Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="e.g., Google" className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="e.g., Senior React Developer" className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  placeholder="Paste the job description or key requirements..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[120px] bg-secondary/50"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Customize</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Key Points to Highlight (Optional)</Label>
                <Textarea
                  placeholder="Any specific achievements or experiences you want to emphasize..."
                  className="min-h-[80px] bg-secondary/50"
                />
              </div>
            </div>
          </div>

          <Button onClick={() => setGenerated(true)} className="w-full bg-primary hover:bg-primary/90 gap-2 h-12">
            <Sparkles className="w-5 h-5" />
            Generate Cover Letter
          </Button>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Generated Letter</h3>
            </div>
            {generated && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="bg-transparent gap-1.5">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent gap-1.5">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            )}
          </div>

          {generated ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 h-[500px] overflow-y-auto">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {sampleCoverLetter}
                </pre>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setGenerated(false)} className="flex-1 bg-transparent gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">Use This Letter</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                <PenTool className="w-10 h-10 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">No letter generated yet</h4>
              <p className="text-sm text-muted-foreground max-w-xs">
                Fill in the job details and click generate to create your personalized cover letter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
