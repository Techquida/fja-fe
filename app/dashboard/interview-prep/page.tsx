"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BadgeCustom } from "@/components/ui/badge-custom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, ChevronDown, ChevronUp, MessageSquare, Lightbulb, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface QuestionItem {
  id: string
  question: string
  answer: string
  tip: string
  category: string
  difficulty: "easy" | "medium" | "hard"
}

const sampleQuestions: QuestionItem[] = [
  {
    id: "1",
    question: "Tell me about yourself and your experience with React.",
    answer:
      "I'm a Senior React Developer with 5+ years of experience building scalable web applications. I started my journey with React in 2018 and have since led multiple projects from conception to production. My expertise includes TypeScript, state management with Redux and React Query, and building accessible, performant user interfaces. In my current role, I've led a team of 5 developers and successfully delivered applications serving over 1 million users.",
    tip: "Keep it concise (2-3 minutes) and focus on relevant experience. Structure: Present role → Key achievements → Why this role interests you.",
    category: "Behavioral",
    difficulty: "easy",
  },
  {
    id: "2",
    question: "How do you handle state management in large React applications?",
    answer:
      "For large applications, I evaluate the state requirements first. For server state, I prefer React Query as it handles caching, synchronization, and background updates elegantly. For client state, I use a combination of React's built-in useState and useContext for simple cases, and Redux Toolkit or Zustand for complex global state. I also leverage the URL as state for shareable UI states. The key is to choose the right tool for each type of state rather than forcing everything into one solution.",
    tip: "Show depth of knowledge by discussing trade-offs. Mention specific tools you've used and explain your decision-making process.",
    category: "Technical",
    difficulty: "medium",
  },
  {
    id: "3",
    question: "Describe a challenging bug you encountered and how you resolved it.",
    answer:
      "I once faced a memory leak in a React application causing the page to crash after extended use. Through profiling with Chrome DevTools, I discovered event listeners weren't being cleaned up in useEffect hooks. The challenge was the leak only manifested in production due to user behavior patterns. I implemented a systematic review of all useEffect cleanup functions, created custom hooks with proper cleanup, and added monitoring for memory usage. The fix reduced memory consumption by 60%.",
    tip: "Use the STAR method: Situation, Task, Action, Result. Focus on your problem-solving approach and what you learned.",
    category: "Behavioral",
    difficulty: "hard",
  },
  {
    id: "4",
    question: "How do you ensure your React components are accessible?",
    answer:
      "Accessibility is integral to my development process. I start with semantic HTML elements and ARIA attributes where needed. I ensure keyboard navigation works correctly and focus management is handled properly for modals and dynamic content. I use tools like axe-core and Lighthouse for automated testing, and manually test with screen readers like VoiceOver. I also consider color contrast, motion preferences, and provide text alternatives for images.",
    tip: "Demonstrate practical knowledge with specific examples. Mention both automated tools and manual testing approaches.",
    category: "Technical",
    difficulty: "medium",
  },
  {
    id: "5",
    question: "Where do you see yourself in 5 years?",
    answer:
      "In 5 years, I see myself as a technical lead or architect, mentoring developers and shaping the technical direction of products. I want to deepen my expertise in performance optimization and system design while expanding into areas like WebAssembly and edge computing. Most importantly, I want to be at a company where I can make meaningful impact on products used by millions, which is why I'm excited about this opportunity at Google.",
    tip: "Show ambition while aligning with the company's growth opportunities. Be genuine but demonstrate you've thought about your career trajectory.",
    category: "Behavioral",
    difficulty: "easy",
  },
]

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [questionType, setQuestionType] = useState("all")

  const generateQuestions = () => {
    setQuestions(sampleQuestions)
    setExpandedId(sampleQuestions[0].id)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Interview Preparation</h1>
        <p className="text-muted-foreground mt-1">Get role-specific questions and AI-suggested answers</p>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              placeholder="e.g., Senior React Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select value={questionType} onValueChange={setQuestionType}>
              <SelectTrigger className="bg-secondary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="situational">Situational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label>Job Description (Optional)</Label>
          <Textarea
            placeholder="Paste the job description for more relevant questions..."
            className="bg-secondary/50"
          />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Uses 1 credit per generation</p>
          <Button onClick={generateQuestions} className="bg-primary hover:bg-primary/90 gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Questions
          </Button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Interview Questions</h3>
            <p className="text-sm text-muted-foreground">{questions.length} questions generated</p>
          </div>

          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={q.id} className="rounded-xl bg-card border border-border overflow-hidden">
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="w-full p-4 flex items-start justify-between text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BadgeCustom variant="secondary" size="sm">
                          {q.category}
                        </BadgeCustom>
                        <BadgeCustom
                          variant={
                            q.difficulty === "easy" ? "success" : q.difficulty === "medium" ? "warning" : "destructive"
                          }
                          size="sm"
                        >
                          {q.difficulty}
                        </BadgeCustom>
                      </div>
                      <p className="font-medium text-foreground">{q.question}</p>
                    </div>
                  </div>
                  {expandedId === q.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    expandedId === q.id ? "max-h-[1000px]" : "max-h-0",
                  )}
                >
                  <div className="p-4 pt-0 space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Suggested Answer</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{q.answer}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">Pro Tip</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{q.tip}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="bg-transparent gap-1.5">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful
                      </Button>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Practice Out Loud
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {questions.length === 0 && (
        <div className="p-12 rounded-xl bg-card border border-border text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No questions yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter the job details above and generate personalized interview questions with AI-suggested answers
          </p>
        </div>
      )}
    </div>
  )
}
