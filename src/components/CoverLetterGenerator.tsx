import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ArrowLeft, Mail, Sparkles, Download, Copy, Check } from "lucide-react";
import { auth, coverLetterService, pointsService } from "../lib/mockBackend";
import { toast } from "sonner";

export function CoverLetterGenerator() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState<"form" | "result">("form");
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    jobDescription: "",
  });
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [letterId, setLetterId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

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
    if (!formData.jobTitle || !formData.company || !formData.jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    if (user && user.points < 1) {
      toast.error("Insufficient points. Please buy more points.");
      navigate("/buy-points");
      return;
    }

    setGenerating(true);

    try {
      pointsService.deductPoints(
        user!.id,
        1,
        "usage",
        "Cover Letter Generation"
      );

      const letter = await coverLetterService.create(
        user!.id,
        formData.jobTitle,
        formData.company,
        formData.jobDescription
      );

      setGeneratedLetter(letter.content);
      setLetterId(letter.id);
      setStep("result");
      toast.success("Cover letter generated successfully! 🎉");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${formData.company}.docx`;
    a.click();
    toast.success("Cover letter downloaded!");
  };

  const handleBack = () => {
    // go back to where user came from, fallback to dashboard
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {step === "form" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2">Generate Cover Letter</h1>
              <p className="text-gray-600">
                Create a professional cover letter tailored to the job
              </p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Costs 1 point</span>
              </div>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="e.g. TechCorp Nigeria"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Paste the full job description here..."
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={12}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Include key requirements and responsibilities for best
                    results
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Cover Letter
                      <Mail className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl mb-2">Cover Letter Ready! 🎉</h1>
              <p className="text-gray-600">
                Your professional cover letter is ready to use
              </p>
            </div>

            <Card className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Your Cover Letter</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generatedLetter}
                </pre>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">What's Next?</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("form");
                    setFormData({
                      jobTitle: "",
                      company: "",
                      jobDescription: "",
                    });
                  }}
                >
                  Generate Another
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/interview-prep")}
                >
                  Interview Prep
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/job-application")}
                >
                  Track Application
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="mb-3">💡 Tips for Using Your Cover Letter</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Personalize the opening and closing paragraphs</li>
                <li>• Add specific examples of your achievements</li>
                <li>
                  • Research the company and mention recent news or projects
                </li>
                <li>• Keep it to one page maximum</li>
                <li>• Proofread carefully before sending</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
