import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Download,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  FileText,
  Mail,
  Sparkles,
  Share2,
} from "lucide-react";

import { cvService } from "../lib/mockBackend";
import type { CVDocument } from "../types";

export function CVOutput() {
  const { cvId } = useParams<{ cvId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [cv, setCv] = useState<CVDocument | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cvId) {
      navigate("/dashboard");
      return;
    }

    const cvData = cvService.getById(cvId);
    if (cvData) {
      setCv(cvData);
    } else {
      // CV not found
      navigate("/dashboard");
    }
    setLoading(false);
  }, [cvId, navigate]);

  const handleBack = () => {
    // Prefer browser back if available (e.g., came from CVFixFlow)
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleDownload = (format: "pdf" | "docx") => {
    if (!cv) return;

    const content = cv.fixedContent || cv.originalContent || "";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cv.name.replace(/\s+/g, "_")}_optimized.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!cv) {
    return null; // Already redirected
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your CV is Ready! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We've transformed your CV into a powerful, ATS-friendly version
            tailored to your target job
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Match Score */}
            <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Job Match Score</h2>
                <Badge className="text-3xl px-6 py-3 bg-green-600">
                  {cv.matchScore}%
                </Badge>
              </div>
              <Progress value={cv.matchScore} className="h-4 mb-4" />
              <p className="text-lg text-gray-700">
                Excellent! Your optimized CV now has a{" "}
                <strong>{cv.matchScore}% match</strong> with the job description
                — far above average for ATS systems.
              </p>
            </Card>

            {/* Key Improvements */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Key Improvements Made</h2>
              <ul className="space-y-4">
                {cv.improvements?.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700 text-base">
                      {improvement}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* CV Preview */}
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">CV Preview</h2>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant={showOriginal ? "outline" : "default"}
                    onClick={() => setShowOriginal(false)}
                  >
                    Optimized Version
                  </Button>
                  <Button
                    size="lg"
                    variant={showOriginal ? "default" : "outline"}
                    onClick={() => setShowOriginal(true)}
                  >
                    Original
                  </Button>
                </div>
              </div>

              <div className="bg-white border-2 border-dashed rounded-xl p-8 min-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {showOriginal ? cv.originalContent : cv.fixedContent}
                </pre>
              </div>
            </Card>

            {/* Download Options */}
            <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Download Your Optimized CV
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Button
                  size="xl"
                  className="py-8 text-lg font-semibold"
                  onClick={() => handleDownload("pdf")}
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download as PDF (Recommended)
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="py-8 text-lg font-semibold"
                  onClick={() => handleDownload("docx")}
                >
                  <Download className="w-6 h-6 mr-3" />
                  Download as DOCX
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Next Steps */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">What's Next?</h3>
              <div className="space-y-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full justify-start text-left py-6"
                  onClick={() => navigate("/cover-letter")}
                >
                  <Mail className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Generate Cover Letter</div>
                    <div className="text-sm text-gray-600">
                      Match it perfectly to this CV
                    </div>
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full justify-start text-left py-6"
                  onClick={() => navigate("/cv-fix")}
                >
                  <FileText className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Optimize Another CV</div>
                    <div className="text-sm text-gray-600">
                      Keep building your arsenal
                    </div>
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full justify-start text-left py-6"
                  onClick={() => navigate("/interview-prep")}
                >
                  <Sparkles className="w-6 h-6 mr-4" />
                  <div>
                    <div className="font-semibold">Prepare for Interview</div>
                    <div className="text-sm text-gray-600">
                      Practice with tailored questions
                    </div>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Pro Tips */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="text-xl font-bold mb-4">💡 Pro Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  • Use the PDF version for online applications (best ATS
                  compatibility)
                </li>
                <li>• Customize slightly for each job you apply to</li>
                <li>• Update your LinkedIn to match this CV</li>
                <li>• Always proofread one final time</li>
                <li>• Follow up 1 week after applying</li>
              </ul>
            </Card>

            {/* Upgrade Suggestion */}
            {cv.fixType === "basic" && (
              <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                <div className="flex items-start gap-4 mb-6">
                  <TrendingUp className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      Want Even Better Results?
                    </h3>
                    <p className="opacity-90">
                      Upgrade to <strong>Smart Rebuild</strong> or{" "}
                      <strong>Full Makeover</strong> for deeper keyword
                      optimization and higher interview rates.
                    </p>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate("/cv-fix")}
                >
                  Try Advanced Fix
                </Button>
              </Card>
            )}

            {/* Referral */}
            <Card className="p-8">
              <h3 className="text-xl font-bold mb-4">Share the Love</h3>
              <p className="text-gray-700 mb-6">
                Help your friends land their dream jobs and earn free points!
              </p>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate("/referral")}
              >
                <Share2 className="w-5 h-5 mr-3" />
                Refer a Friend & Earn Points
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
