// src/components/CVFixFlow.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Zap,
  Award,
  Star,
} from "lucide-react";

import { auth, cvService, pointsService } from "../lib/mockBackend";
import { toast } from "sonner";
import type { FixType } from "../types";

export function CVFixFlow() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [cvContent, setCvContent] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFixType, setSelectedFixType] = useState<
    "basic" | "smart" | "full" | null
  >(null);
  const [processing, setProcessing] = useState(false);

  const user = auth.getCurrentUser();

  const fixTypes: FixType[] = [
    {
      id: "basic",
      name: "Basic Refix",
      description: "Quick grammar and formatting fixes",
      points: 1,
      features: [
        "Grammar and spelling check",
        "Format standardization",
        "Basic ATS optimization",
        "Quick turnaround",
      ],
    },
    {
      id: "smart",
      name: "Smart Rebuild",
      description: "AI-powered CV optimization",
      points: 3,
      features: [
        "Everything in Basic",
        "Keyword optimization",
        "Achievement quantification",
        "Section reordering",
        "Match score analysis",
      ],
    },
    {
      id: "full",
      name: "Full New CV",
      description: "Complete professional makeover",
      points: 5,
      features: [
        "Everything in Smart",
        "Complete restructure",
        "Industry-specific templates",
        "Nigerian market optimization",
        "Premium formatting",
        "Cover letter suggestions",
      ],
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Maximum 5MB.");
        return;
      }
      setCvFile(file);
      toast.success(`${file.name} uploaded successfully!`);
    }
  };

  const handleContinueToJobDesc = () => {
    if (!cvContent.trim() && !cvFile) {
      toast.error("Please upload a CV file or paste your CV content.");
      return;
    }
    setStep(2);
  };

  const handleContinueToFixType = () => {
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description.");
      return;
    }
    setStep(3);
  };

  const handleProcessCV = async () => {
    if (!selectedFixType) {
      toast.error("Please select a fix type.");
      return;
    }

    const fixType = fixTypes.find((f) => f.id === selectedFixType)!;

    // Check points
    if (!user || user.points < fixType.points) {
      toast.error("Insufficient points!");
      navigate("/buy-points");
      return;
    }

    setProcessing(true);

    try {
      // Create CV record
      const cv = await cvService.create(user.id, {
        name: cvFile?.name || "My CV",
        originalContent: cvContent || "[Content extracted from uploaded file]",
        jobDescription,
        fixType: selectedFixType,
        fileType: cvFile
          ? cvFile.name.endsWith(".pdf")
            ? "pdf"
            : "docx"
          : "text",
      });

      // Deduct points
      pointsService.deductPoints(
        user.id,
        fixType.points,
        "usage",
        `${fixType.name} - CV Fix`
      );

      // Simulate AI processing
      await cvService.processFix(cv.id, selectedFixType);

      toast.success("Your CV has been optimized successfully! 🎉");

      // Navigate to output page
      navigate(`/cv-output/${cv.id}`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Step 1: Upload CV */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Upload Your CV</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload your current CV (PDF/DOCX) or paste the text directly
              </p>
            </div>

            <Card className="p-10">
              <div className="space-y-8">
                {/* File Upload */}
                <div>
                  <Label className="text-lg mb-4 block">Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-purple-500 transition-colors bg-gray-50/50">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer block">
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      {cvFile ? (
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-green-600">
                            ✓ {cvFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Click to change
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg mb-2">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF or DOCX • Max 5MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="relative text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <span className="relative bg-gray-50 px-4 text-gray-500">
                    OR
                  </span>
                </div>

                {/* Paste Text */}
                <div>
                  <Label htmlFor="cv-text" className="text-lg mb-4 block">
                    Paste Your CV Text
                  </Label>
                  <Textarea
                    id="cv-text"
                    placeholder="Paste your full CV content here..."
                    value={cvContent}
                    onChange={(e) => setCvContent(e.target.value)}
                    rows={14}
                    className="font-mono text-sm resize-none"
                  />
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg py-7"
                  onClick={handleContinueToJobDesc}
                >
                  Continue to Job Description
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Paste Job Description</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The more detailed the job post, the better we can tailor your CV
              </p>
            </div>

            <Card className="p-10">
              <Label htmlFor="job-desc" className="text-lg mb-4 block">
                Full Job Description
              </Label>
              <Textarea
                id="job-desc"
                placeholder="Paste the complete job description here, including responsibilities, requirements, qualifications, and company info..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={18}
                className="text-base"
              />

              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Pro tip: Copy the entire job posting for the most accurate
                optimization
              </p>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  size="lg"
                  className="flex-1 text-lg py-7"
                  onClick={handleContinueToFixType}
                >
                  Choose Fix Type
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Choose Fix Type */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Choose Your Fix Level</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select how deeply you want FlowJobAi to optimize your CV
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {fixTypes.map((fixType) => {
                const isSelected = selectedFixType === fixType.id;
                const canAfford = user && user.points >= fixType.points;
                const Icon =
                  fixType.id === "basic"
                    ? FileText
                    : fixType.id === "smart"
                    ? Sparkles
                    : Award;

                return (
                  <Card
                    key={fixType.id}
                    className={`relative p-8 cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? "border-purple-600 shadow-2xl ring-4 ring-purple-100 scale-105"
                        : canAfford
                        ? "hover:shadow-xl hover:border-purple-400"
                        : "opacity-60 cursor-not-allowed"
                    }`}
                    onClick={() => canAfford && setSelectedFixType(fixType.id)}
                  >
                    {fixType.id === "smart" && (
                      <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
                        MOST POPULAR
                      </Badge>
                    )}

                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                        isSelected ? "bg-purple-600" : "bg-purple-100"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          isSelected ? "text-white" : "text-purple-600"
                        }`}
                      />
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{fixType.name}</h3>
                    <p className="text-gray-600 mb-6">{fixType.description}</p>

                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-4xl font-bold">
                        {fixType.points}
                      </span>
                      <span className="text-xl text-gray-600">
                        point{fixType.points > 1 ? "s" : ""}
                      </span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {fixType.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {!canAfford && (
                      <div className="text-center pt-4 border-t">
                        <p className="text-red-600 text-sm">
                          Need {fixType.points - (user?.points || 0)} more
                          points
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Low Points Warning */}
            {user && user.points < 1 && (
              <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Zap className="w-10 h-10 text-yellow-600" />
                    <div>
                      <p className="font-semibold">Running low on points?</p>
                      <p className="text-gray-700">
                        You need at least 1 point to fix your CV
                      </p>
                    </div>
                  </div>
                  <Button size="lg" onClick={() => navigate("/buy-points")}>
                    Buy Points Now
                  </Button>
                </div>
              </Card>
            )}

            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                size="lg"
                className="flex-1 text-lg py-7"
                onClick={handleProcessCV}
                disabled={!selectedFixType || processing}
              >
                {processing ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                    Processing Your CV...
                  </>
                ) : (
                  <>
                    Fix My CV Now
                    <CheckCircle className="w-6 h-6 ml-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
