import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  FileText, 
  Mail, 
  MessageSquare, 
  Send, 
  Wallet, 
  Download,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Zap
} from 'lucide-react';
import { auth, cvService, coverLetterService, interviewPrepService, jobApplicationService, notificationService } from '../lib/mockBackend';
import type { User, CVDocument, CoverLetter, InterviewPrep, JobApplication } from '../types';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [cvs, setCvs] = useState<CVDocument[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [interviewPreps, setInterviewPreps] = useState<InterviewPrep[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCvs(cvService.getAll(currentUser.id));
      setCoverLetters(coverLetterService.getAll(currentUser.id));
      setInterviewPreps(interviewPrepService.getAll(currentUser.id));
      setApplications(jobApplicationService.getAll(currentUser.id));
      setUnreadNotifications(notificationService.getUnreadCount(currentUser.id));
    }
  };

  if (!user) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      icon: FileText,
      title: 'Fix CV',
      description: 'Upload and optimize your CV',
      color: 'from-purple-600 to-blue-600',
      onClick: () => onNavigate('cv-fix')
    },
    {
      icon: Mail,
      title: 'Cover Letter',
      description: 'Generate professional cover letter',
      color: 'from-blue-600 to-cyan-600',
      onClick: () => onNavigate('cover-letter')
    },
    {
      icon: MessageSquare,
      title: 'Interview Prep',
      description: 'Prepare for your interview',
      color: 'from-cyan-600 to-teal-600',
      onClick: () => onNavigate('interview-prep')
    },
    {
      icon: Send,
      title: 'Apply to Job',
      description: 'Track your applications',
      color: 'from-teal-600 to-green-600',
      onClick: () => onNavigate('job-application')
    }
  ];

  const stats = [
    { icon: FileText, label: 'CVs Fixed', value: cvs.length, color: 'text-purple-600' },
    { icon: Mail, label: 'Cover Letters', value: coverLetters.length, color: 'text-blue-600' },
    { icon: Send, label: 'Applications', value: applications.length, color: 'text-green-600' },
    { icon: Award, label: 'Day Streak', value: user.streak, color: 'text-orange-600' }
  ];

  const sampleJobs = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Nigeria',
      location: 'Lagos',
      salary: '₦800K - ₦1.2M',
      match: 92
    },
    {
      title: 'Product Manager',
      company: 'FinTech Solutions',
      location: 'Abuja',
      salary: '₦600K - ₦900K',
      match: 85
    },
    {
      title: 'Marketing Specialist',
      company: 'Brand Masters',
      location: 'Port Harcourt',
      salary: '₦350K - ₦500K',
      match: 78
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl">ResumeGenie</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onNavigate('notifications')}
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onNavigate('settings')}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Greeting & Points */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">
            {greeting()}, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Ready to take your career to the next level?</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Points Card */}
            <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Your Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl">{user.points}</span>
                    <span className="text-xl">points</span>
                  </div>
                  {!user.firstFreeUsed && (
                    <Badge variant="secondary" className="mt-3 bg-white/20 text-white border-0">
                      🎁 1 free CV fix available
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <Wallet className="w-12 h-12 opacity-50 mb-4" />
                  <Button 
                    variant="secondary"
                    onClick={() => onNavigate('buy-points')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Buy Points
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card 
                      key={index}
                      className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={action.onClick}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-xl mb-4">Your Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="p-4">
                      <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                      <div className="text-2xl mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Recent Activity</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('history')}
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-3">
                {cvs.slice(0, 3).map((cv) => (
                  <Card key={cv.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="mb-1 truncate">{cv.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(cv.createdAt).toLocaleDateString()}</span>
                            {cv.matchScore && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">{cv.matchScore}% match</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {cv.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {cvs.length === 0 && (
                  <Card className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No CVs yet. Start by fixing your first CV!</p>
                    <Button onClick={() => onNavigate('cv-fix')}>
                      Fix Your CV Now
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Jobs */}
            <div>
              <h2 className="text-xl mb-4">Suggested Jobs</h2>
              <div className="space-y-3">
                {sampleJobs.map((job, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-sm truncate">{job.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{job.company}</p>
                      </div>
                      <Badge variant={job.match >= 85 ? "default" : "secondary"} className="ml-2">
                        {job.match}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Jobs
              </Button>
            </div>

            {/* Referral Promo */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="mb-1">Refer & Earn</h3>
                  <p className="text-sm text-gray-700">
                    Get 2 points for each friend who joins
                  </p>
                </div>
              </div>
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => onNavigate('referral')}
              >
                Invite Friends
              </Button>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3>Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Tailor your CV for each job application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Use keywords from the job description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Keep your CV to 1-2 pages maximum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Quantify your achievements with numbers</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
