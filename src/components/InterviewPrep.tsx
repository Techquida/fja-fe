import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { ArrowLeft, MessageSquare, Sparkles, Lightbulb, Target, Download } from 'lucide-react';
import { auth, interviewPrepService, pointsService } from '../lib/mockBackend';
import { toast } from 'sonner@2.0.3';
import type { InterviewPrep as InterviewPrepType } from '../types';

interface InterviewPrepProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function InterviewPrep({ onBack, onNavigate }: InterviewPrepProps) {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: ''
  });
  const [prep, setPrep] = useState<InterviewPrepType | null>(null);
  const [generating, setGenerating] = useState(false);

  const user = auth.getCurrentUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.jobDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    if (user && user.points < 1) {
      toast.error('Insufficient points. Please buy more points.');
      onNavigate('buy-points');
      return;
    }

    setGenerating(true);

    try {
      // Deduct points
      pointsService.deductPoints(user!.id, 1, 'usage', 'Interview Preparation');

      // Generate interview prep
      const prepData = await interviewPrepService.create(
        user!.id,
        formData.jobTitle,
        formData.jobDescription
      );

      setPrep(prepData);
      setStep('result');
      toast.success('Interview prep generated successfully! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate interview prep');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!prep) return;
    
    let content = `Interview Preparation for ${formData.jobTitle}\n\n`;
    content += `INTERVIEW QUESTIONS & ANSWERS\n${'='.repeat(50)}\n\n`;
    
    prep.questions.forEach((q, index) => {
      content += `Question ${index + 1}: ${q.question}\n\n`;
      content += `Suggested Answer:\n${q.suggestedAnswer}\n\n`;
      content += `Tips:\n${q.tips.map(t => `• ${t}`).join('\n')}\n\n`;
      content += `${'='.repeat(50)}\n\n`;
    });
    
    content += `GENERAL TIPS\n${'='.repeat(50)}\n\n`;
    content += prep.tips.join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-prep-${formData.jobTitle.replace(/\s+/g, '-')}.txt`;
    a.click();
    toast.success('Interview prep downloaded!');
  };

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
              <MessageSquare className="w-5 h-5 text-cyan-600" />
              <span>Interview Preparation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>{user?.points} points</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {step === 'form' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl mb-2">Prepare for Your Interview</h1>
              <p className="text-gray-600">
                Get AI-powered questions, answers, and tips
              </p>
              <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Costs 1 point</span>
              </div>
            </div>

            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="e.g. Senior Product Manager"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Paste the job description including key responsibilities and requirements..."
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={12}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 The more detail you provide, the better the questions we'll generate
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
                      Generate Interview Prep
                      <MessageSquare className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === 'result' && prep && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl mb-2">You're Ready! 💪</h1>
              <p className="text-gray-600">
                Practice these questions and ace your interview
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>

            {/* Interview Questions */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl">Interview Questions & Answers</h2>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {prep.questions.map((question, index) => (
                  <AccordionItem key={index} value={`question-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-3">
                        <Badge variant="secondary" className="flex-shrink-0">
                          Q{index + 1}
                        </Badge>
                        <span>{question.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4 pl-11">
                        <div>
                          <h4 className="text-sm text-purple-600 mb-2">
                            Suggested Answer:
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {question.suggestedAnswer}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm text-purple-600 mb-2">
                            Tips:
                          </h4>
                          <ul className="space-y-1">
                            {question.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-purple-600">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            {/* General Tips */}
            <Card className="p-6 bg-gradient-to-br from-cyan-50 to-teal-50">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-cyan-600" />
                <h2 className="text-xl">General Interview Tips</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {prep.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-6">
              <h3 className="mb-4">What's Next?</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep('form');
                    setFormData({ jobTitle: '', jobDescription: '' });
                  }}
                >
                  Prepare for Another
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('cover-letter')}
                >
                  Generate Cover Letter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('cv-fix')}
                >
                  Fix Your CV
                </Button>
              </div>
            </Card>

            {/* Additional Tips */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h3 className="mb-3">🎯 Remember</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Practice answering these questions out loud</li>
                <li>• Research the company thoroughly before the interview</li>
                <li>• Prepare your own questions to ask the interviewer</li>
                <li>• Arrive 10-15 minutes early (or login early for virtual interviews)</li>
                <li>• Follow up with a thank-you email within 24 hours</li>
              </ul>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
