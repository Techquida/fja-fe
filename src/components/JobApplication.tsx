import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Send, FileText, Mail, CheckCircle, Clock, XCircle } from 'lucide-react';
import { auth, cvService, coverLetterService, jobApplicationService } from '../lib/mockBackend';
import { toast } from 'sonner@2.0.3';
import type { CVDocument, CoverLetter, JobApplication } from '../types';

interface JobApplicationProps {
  onBack: () => void;
}

export function JobApplication({ onBack }: JobApplicationProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [cvs, setCvs] = useState<CVDocument[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedTab, setSelectedTab] = useState<'track' | 'new'>('track');

  const user = auth.getCurrentUser();

  useEffect(() => {
    if (user) {
      setApplications(jobApplicationService.getAll(user.id));
      setCvs(cvService.getAll(user.id).filter(cv => cv.status === 'completed'));
      setCoverLetters(coverLetterService.getAll(user.id));
    }
  }, [user]);

  const getStatusIcon = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return <Send className="w-4 h-4 text-blue-600" />;
      case 'reviewing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'interview':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-700';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-700';
      case 'interview':
        return 'bg-purple-100 text-purple-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
    }
  };

  const handleStatusUpdate = (appId: string, newStatus: JobApplication['status']) => {
    jobApplicationService.updateStatus(appId, newStatus);
    setApplications(jobApplicationService.getAll(user!.id));
    toast.success('Application status updated!');
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
              <Send className="w-5 h-5 text-green-600" />
              <span>Job Applications</span>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">Track Your Applications</h1>
          <p className="text-gray-600">
            Keep all your job applications organized in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedTab === 'track' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('track')}
          >
            My Applications ({applications.length})
          </Button>
          <Button
            variant={selectedTab === 'new' ? 'default' : 'outline'}
            onClick={() => setSelectedTab('new')}
          >
            Track New Application
          </Button>
        </div>

        {selectedTab === 'track' && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app) => (
                <Card key={app.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl">{app.jobTitle}</h3>
                        <Badge className={getStatusColor(app.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(app.status)}
                            {app.status}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{app.company}</p>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Select
                      value={app.status}
                      onValueChange={(value) => handleStatusUpdate(app.id, value as JobApplication['status'])}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {app.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{app.notes}</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No applications tracked yet</p>
                <Button onClick={() => setSelectedTab('new')}>
                  Track Your First Application
                </Button>
              </Card>
            )}
          </div>
        )}

        {selectedTab === 'new' && (
          <Card className="p-8">
            <h2 className="text-2xl mb-6">Track a New Application</h2>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Application tracking feature is currently in development
              </p>
              <p className="text-sm text-gray-500">
                For now, you can track your applications manually in the table above
              </p>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">{applications.length}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1 text-yellow-600">
              {applications.filter(a => a.status === 'reviewing').length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1 text-purple-600">
              {applications.filter(a => a.status === 'interview').length}
            </div>
            <div className="text-sm text-gray-600">Interviews</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1 text-green-600">
              {applications.filter(a => a.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Offers</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
