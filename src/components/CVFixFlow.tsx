import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { auth, cvService, pointsService } from '../lib/mockBackend';
import { toast } from 'sonner@2.0.3';
import type { FixType } from '../types';

interface CVFixFlowProps {
  onBack: () => void;
  onComplete: (cvId: string) => void;
  onNavigate: (page: string) => void;
}

export function CVFixFlow({ onBack, onComplete, onNavigate }: CVFixFlowProps) {
  const [step, setStep] = useState(1);
  const [cvContent, setCvContent] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFixType, setSelectedFixType] = useState<'basic' | 'smart' | 'full' | null>(null);
  const [processing, setProcessing] = useState(false);

  const user = auth.getCurrentUser();

  const fixTypes: FixType[] = [
    {
      id: 'basic',
      name: 'Basic Refix',
      description: 'Quick grammar and formatting fixes',
      points: 1,
      features: [
        'Grammar and spelling check',
        'Format standardization',
        'Basic ATS optimization',
        'Quick turnaround'
      ]
    },
    {
      id: 'smart',
      name: 'Smart Rebuild',
      description: 'AI-powered CV optimization',
      points: 3,
      features: [
        'Everything in Basic',
        'Keyword optimization',
        'Achievement quantification',
        'Section reordering',
        'Match score analysis'
      ]
    },
    {
      id: 'full',
      name: 'Full New CV',
      description: 'Complete professional makeover',
      points: 5,
      features: [
        'Everything in Smart',
        'Complete restructure',
        'Industry-specific templates',
        'Nigerian market optimization',
        'Premium formatting',
        'Cover letter suggestions'
      ]
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      // In real app, extract text from PDF/DOCX
      toast.success('CV uploaded successfully!');
    }
  };

  const handleContinueToJobDesc = () => {
    if (!cvContent && !cvFile) {
      toast.error('Please upload a CV or paste your CV content');
      return;
    }
    setStep(2);
  };

  const handleContinueToFixType = () => {
    if (!jobDescription) {
      toast.error('Please paste the job description');
      return;
    }
    setStep(3);
  };

  const handleProcessCV = async () => {
    if (!selectedFixType) {
      toast.error('Please select a fix type');
      return;
    }

    const fixType = fixTypes.find(f => f.id === selectedFixType)!;

    // Check points
    if (user && user.points < fixType.points) {
      toast.error('Insufficient points. Please buy more points.');
      onNavigate('buy-points');
      return;
    }

    setProcessing(true);

    try {
      // Create CV record
      const cv = await cvService.create(user!.id, {
        name: cvFile?.name || 'My CV',
        originalContent: cvContent || 'Uploaded file content',
        jobDescription,
        fixType: selectedFixType,
        fileType: cvFile ? (cvFile.name.endsWith('.pdf') ? 'pdf' : 'docx') : 'text'
      });

      // Deduct points
      pointsService.deductPoints(
        user!.id,
        fixType.points,
        'usage',
        `${fixType.name} - CV Fix`
      );

      // Process the CV
      await cvService.processFix(cv.id, selectedFixType);

      toast.success('CV processed successfully! 🎉');
      onComplete(cv.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to process CV');
    } finally {
      setProcessing(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>CV Fix Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>{user?.points} points</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Upload CV */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2">Upload Your CV</h1>
              <p className="text-gray-600">
                Upload your CV file or paste the content below
              </p>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <Label className="mb-3 block">Upload CV File (PDF/DOCX)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      {cvFile ? (
                        <div>
                          <p className="text-green-600 mb-1">✓ {cvFile.name}</p>
                          <p className="text-sm text-gray-500">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-1">Click to upload or drag and drop</p>
                          <p className="text-sm text-gray-500">PDF or DOCX (Max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* Paste CV Text */}
                <div>
                  <Label htmlFor="cv-text" className="mb-3 block">
                    Paste CV Text
                  </Label>
                  <Textarea
                    id="cv-text"
                    placeholder="Paste your CV content here..."
                    value={cvContent}
                    onChange={(e) => setCvContent(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleContinueToJobDesc}
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2">Add Job Description</h1>
              <p className="text-gray-600">
                Paste the job description to tailor your CV
              </p>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="job-desc" className="mb-3 block">
                    Job Description
                  </Label>
                  <Textarea
                    id="job-desc"
                    placeholder="Paste the full job description here, including requirements, responsibilities, and qualifications..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={15}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Tip: Include the complete job posting for best results
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={handleContinueToFixType}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Choose Fix Type */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2">Choose Fix Type</h1>
              <p className="text-gray-600">
                Select the level of optimization for your CV
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {fixTypes.map((fixType) => {
                const isSelected = selectedFixType === fixType.id;
                const canAfford = user && user.points >= fixType.points;
                const Icon = fixType.id === 'basic' ? FileText : fixType.id === 'smart' ? Sparkles : Award;

                return (
                  <Card 
                    key={fixType.id}
                    className={`p-6 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-600 shadow-lg ring-2 ring-purple-200' 
                        : canAfford 
                        ? 'hover:border-purple-400' 
                        : 'opacity-60 cursor-not-allowed'
                    } ${fixType.id === 'smart' ? 'relative' : ''}`}
                    onClick={() => canAfford && setSelectedFixType(fixType.id)}
                  >
                    {fixType.id === 'smart' && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                        Most Popular
                      </Badge>
                    )}

                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                      isSelected ? 'bg-purple-600' : 'bg-purple-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
                    </div>

                    <h3 className="mb-2">{fixType.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{fixType.description}</p>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl">{fixType.points}</span>
                      <span className="text-gray-600">point{fixType.points > 1 ? 's' : ''}</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {fixType.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {!canAfford && (
                      <Badge variant="secondary" className="w-full justify-center">
                        Need {fixType.points - (user?.points || 0)} more points
                      </Badge>
                    )}
                  </Card>
                );
              })}
            </div>

            {user && user.points < 1 && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="mb-2">
                      You don't have enough points to fix your CV.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => onNavigate('buy-points')}
                    >
                      Buy Points
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setStep(2)}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button 
                size="lg" 
                className="flex-1"
                onClick={handleProcessCV}
                disabled={!selectedFixType || processing}
              >
                {processing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Fix My CV
                    <CheckCircle className="w-5 h-5 ml-2" />
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
