// src/components/InterviewPrep.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Lightbulb,
  Target,
  Download,
} from "lucide-react";

import { auth, interviewPrepService, pointsService } from "../lib/mockBackend";
import { toast } from "sonner";
import type { InterviewPrep as InterviewPrepType } from "../types";

export function InterviewPrep() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
  });
  const [prep, setPrep] = useState<InterviewPrepType | null>(null);
  const [generating, setGenerating] = useState(false);

  const user = auth.getCurrentUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle.trim() || !formData.jobDescription.trim()) {
      toast.error("Please fill in both the job title and description");
      return;
    }

    if (!user || user.points < 1) {
      toast.error("You need at least 1 point to generate interview prep");
      navigate("/buy-points");
      return;
    }

    setGenerating(true);

    try {
      // Deduct point
      pointsService.deductPoints(user.id, 1, "usage", "Interview Preparation");

      // Generate prep
      const prepData = await interviewPrepService.create(
        user.id,
        formData.jobTitle,
        formData.jobDescription
      );

      setPrep(prepData);
      setStep("result");
      toast.success("Interview prep generated successfully! 💪");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate interview prep");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!prep) return;

    let content = `Interview Preparation - ${formData.jobTitle}\n\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `${"=".repeat(60)}\n\n`;

    content += `TAILORED INTERVIEW QUESTIONS\n${"=".repeat(60)}\n\n`;

    prep.questions.forEach((q, i) => {
      content += `Q${i + 1}: ${q.question}\n\n`;
      content += `Suggested Answer:\n${q.suggestedAnswer}\n\n`;
      content += `Tips:\n${q.tips.map((t) => `• ${t}`).join("\n")}\n\n`;
      content += `${"-".repeat(60)}\n\n`;
    });

    content += `GENERAL TIPS\n${"=".repeat(60)}\n\n`;
    content += prep.tips.map((t) => `• ${t}`).join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-prep-${formData.jobTitle
      .replace(/\s+/g, "-")
      .toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Interview prep downloaded!");
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {step === "form" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Ace Your Next Interview
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                Get personalized questions, model answers, and expert tips based
                on your target job
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-50 text-cyan-700 rounded-xl text-base font-medium">
                <Sparkles className="w-5 h-5" />
                <span>Costs 1 point</span>
              </div>
            </div>

            <Card className="p-10 shadow-lg">
              <div className="space-y-8">
                <div>
                  <Label htmlFor="jobTitle" className="text-lg">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="e.g. Senior Product Manager, Frontend Developer"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="mt-2 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription" className="text-lg">
                    Job Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Paste the full job description here — include responsibilities, required skills, and qualifications for the most accurate questions..."
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={14}
                    className="mt-2 text-base"
                  />
                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    The more details you provide, the better and more relevant
                    the questions will be
                  </p>
                </div>

                <Button
                  size="xl"
                  className="w-full py-8 text-lg font-semibold"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                      Generating Your Prep...
                    </>
                  ) : (
                    <>
                      Generate Interview Prep
                      <MessageSquare className="w-6 h-6 ml-3" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "result" && prep && (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                You're Ready to Shine! 💪
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Practice these tailored questions and walk into your interview
                with confidence
              </p>
            </div>

            <div className="flex justify-end mb-4">
              <Button size="lg" variant="outline" onClick={handleDownload}>
                <Download className="w-5 h-5 mr-2" />
                Download Full Prep (TXT)
              </Button>
            </div>

            {/* Questions Accordion */}
            <Card className="p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <Target className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl font-bold">
                  Tailored Interview Questions
                </h2>
              </div>

              <Accordion
                type="single"
                collapsible
                defaultValue="question-0"
                className="space-y-4"
              >
                {prep.questions.map((question, index) => (
                  <AccordionItem
                    key={index}
                    value={`question-${index}`}
                    className="border rounded-lg px-6"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-start gap-4 text-left">
                        <Badge
                          variant="secondary"
                          className="text-lg px-3 py-1 mt-1"
                        >
                          Q{index + 1}
                        </Badge>
                        <span className="font-medium text-base">
                          {question.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 pl-14 space-y-6">
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2">
                          Suggested Answer:
                        </h4>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {question.suggestedAnswer}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2">
                          Pro Tips:
                        </h4>
                        <ul className="space-y-2">
                          {question.tips.map((tip, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-gray-700"
                            >
                              <span className="text-purple-600 mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* General Tips */}
            <Card className="p-8 bg-gradient-to-br from-cyan-50 to-teal-50">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-7 h-7 text-cyan-600" />
                <h2 className="text-2xl font-bold">General Interview Tips</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {prep.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-base">
                    <CheckCircle className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">What's Next?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="py-6"
                  onClick={() => {
                    setStep("form");
                    setFormData({ jobTitle: "", jobDescription: "" });
                    setPrep(null);
                  }}
                >
                  Prepare for Another Role
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="py-6"
                  onClick={() => navigate("/cover-letter")}
                >
                  Generate Cover Letter
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="py-6"
                  onClick={() => navigate("/cv-fix")}
                >
                  Optimize Your CV
                </Button>
              </div>
            </Card>

            {/* Final Motivation */}
            <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">You've Got This! 🚀</h3>
                <p className="text-lg opacity-90 max-w-2xl mx-auto">
                  Practice these answers out loud, stay confident, and remember:
                  they've already chosen to interview you because they see
                  potential.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
