import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Download, 
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  FileText,
  Mail,
  Sparkles,
  Share2
} from 'lucide-react';
import { cvService } from '../lib/mockBackend';
import type { CVDocument } from '../types';

interface CVOutputProps {
  cvId: string;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function CVOutput({ cvId, onBack, onNavigate }: CVOutputProps) {
  const [cv, setCv] = useState<CVDocument | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    const cvData = cvService.getById(cvId);
    setCv(cvData);
  }, [cvId]);

  if (!cv) return null;

  const handleDownload = (format: 'pdf' | 'docx') => {
    // In real app, generate and download file
    const blob = new Blob([cv.fixedContent || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cv.name}_fixed.${format}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>CV Output</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl mb-2">Your CV is Ready! 🎉</h1>
          <p className="text-gray-600">
            We've optimized your CV for maximum impact
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Score */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Match Score</h2>
                <Badge className="bg-green-600 text-lg px-4 py-2">
                  {cv.matchScore}%
                </Badge>
              </div>
              <Progress value={cv.matchScore} className="h-3 mb-4" />
              <p className="text-gray-600">
                Your CV has a {cv.matchScore}% match with the job description. 
                This is an excellent score for ATS systems!
              </p>
            </Card>

            {/* Key Improvements */}
            <Card className="p-6">
              <h2 className="text-xl mb-4">Key Improvements Made</h2>
              <ul className="space-y-3">
                {cv.improvements?.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* CV Preview Toggle */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">CV Preview</h2>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={showOriginal ? 'outline' : 'default'}
                    onClick={() => setShowOriginal(false)}
                  >
                    Optimized
                  </Button>
                  <Button
                    size="sm"
                    variant={showOriginal ? 'default' : 'outline'}
                    onClick={() => setShowOriginal(true)}
                  >
                    Original
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {showOriginal ? cv.originalContent : cv.fixedContent}
                </pre>
              </div>
            </Card>

            {/* Download Options */}
            <Card className="p-6">
              <h2 className="text-xl mb-4">Download Your CV</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  size="lg"
                  onClick={() => handleDownload('pdf')}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download as PDF
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => handleDownload('docx')}
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download as DOCX
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card className="p-6">
              <h3 className="mb-4">What's Next?</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('cover-letter')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Generate Cover Letter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('cv-fix')}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Fix Another CV
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('interview-prep')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Prepare for Interview
                </Button>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Download both PDF and DOCX versions</li>
                <li>• Customize the CV for each application</li>
                <li>• Update your LinkedIn profile to match</li>
                <li>• Proofread one more time before sending</li>
                <li>• Follow up with the employer after applying</li>
              </ul>
            </Card>

            {/* Upgrade Suggestion */}
            {cv.fixType === 'basic' && (
              <Card className="p-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <h3 className="mb-2">Want an Even Better CV?</h3>
                    <p className="text-sm text-purple-100">
                      Upgrade to Smart Rebuild for deeper optimization and higher match scores
                    </p>
                  </div>
                </div>
                <Button 
                  variant="secondary"
                  className="w-full"
                  onClick={() => onNavigate('cv-fix')}
                >
                  Try Smart Rebuild
                </Button>
              </Card>
            )}

            {/* Share */}
            <Card className="p-6">
              <h3 className="mb-3">Share Your Success</h3>
              <p className="text-sm text-gray-600 mb-4">
                Help your friends land their dream jobs too!
              </p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('referral')}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Refer a Friend
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
