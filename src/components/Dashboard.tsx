import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
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
  Zap,
} from "lucide-react";

import {
  auth,
  cvService,
  coverLetterService,
  interviewPrepService,
  jobApplicationService,
  notificationService,
} from "../lib/mockBackend";
import type {
  User,
  CVDocument,
  CoverLetter,
  InterviewPrep,
  JobApplication,
} from "../types";

export function Dashboard() {
  const navigate = useNavigate();
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
      setUnreadNotifications(
        notificationService.getUnreadCount(currentUser.id)
      );
    }
  };

  if (!user) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    {
      icon: FileText,
      title: "Fix CV",
      description: "Upload and optimize your CV",
      color: "from-purple-600 to-blue-600",
      path: "/cv-fix",
    },
    {
      icon: Mail,
      title: "Cover Letter",
      description: "Generate professional cover letter",
      color: "from-blue-600 to-cyan-600",
      path: "/cover-letter",
    },
    {
      icon: MessageSquare,
      title: "Interview Prep",
      description: "Prepare for your interview",
      color: "from-cyan-600 to-teal-600",
      path: "/interview-prep",
    },
    {
      icon: Send,
      title: "Apply to Job",
      description: "Track your applications",
      color: "from-teal-600 to-green-600",
      path: "/job-application",
    },
  ];

  const stats = [
    {
      icon: FileText,
      label: "CVs Fixed",
      value: cvs.length,
      color: "text-purple-600",
    },
    {
      icon: Mail,
      label: "Cover Letters",
      value: coverLetters.length,
      color: "text-blue-600",
    },
    {
      icon: Send,
      label: "Applications",
      value: applications.length,
      color: "text-green-600",
    },
    {
      icon: Award,
      label: "Day Streak",
      value: user.streak,
      color: "text-orange-600",
    },
  ];

  const sampleJobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Nigeria",
      location: "Lagos",
      salary: "₦800K - ₦1.2M",
      match: 92,
    },
    {
      title: "Product Manager",
      company: "FinTech Solutions",
      location: "Abuja",
      salary: "₦600K - ₦900K",
      match: 85,
    },
    {
      title: "Marketing Specialist",
      company: "Brand Masters",
      location: "Port Harcourt",
      salary: "₦350K - ₦500K",
      match: 78,
    },
  ];

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {greeting()}, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 text-lg">
            Ready to take your career to the next level?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Points Card */}
            <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Your Balance</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{user.points}</span>
                    <span className="text-xl opacity-90">points</span>
                  </div>
                  {!user.firstFreeUsed && (
                    <Badge
                      variant="secondary"
                      className="mt-4 bg-white/20 text-white border-0"
                    >
                      1 free CV fix available
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <Wallet className="w-16 h-16 opacity-40 mb-4" />
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/buy-points")}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Buy Points
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card
                      key={index}
                      className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      onClick={() => navigate(action.path)}
                    >
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600">{action.description}</p>
                      <ChevronRight className="w-6 h-6 text-gray-400 mt-4 ml-auto" />
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Activity</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="p-5 text-center hover:shadow-md transition-shadow"
                    >
                      <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {stat.label}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent CVs</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/history")}
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {cvs.slice(0, 3).map((cv) => (
                  <Card
                    key={cv.id}
                    className="p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{cv.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(cv.createdAt).toLocaleDateString()}
                            </span>
                            {cv.matchScore && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">
                                  {cv.matchScore}% match
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {cv.status === "completed" && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}

                {cvs.length === 0 && (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">
                      No CVs yet. Start optimizing your first one!
                    </p>
                    <Button size="lg" onClick={() => navigate("/cv-fix")}>
                      Fix Your CV Now
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Suggested Jobs */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Suggested Jobs</h2>
              <div className="space-y-4">
                {sampleJobs.map((job, index) => (
                  <Card
                    key={index}
                    className="p-5 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{job.title}</h3>
                        <p className="text-sm text-gray-600 truncate">
                          {job.company}
                        </p>
                      </div>
                      <Badge
                        variant={job.match >= 85 ? "default" : "secondary"}
                        className="ml-3"
                      >
                        {job.match}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6">
                View All Jobs
              </Button>
            </div>

            {/* Referral Promo */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-pink-50 border-orange-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
                  <p className="text-gray-700">
                    Get 2 points for each friend who joins!
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => navigate("/referral")}
              >
                Invite Friends
              </Button>
            </Card>

            {/* Pro Tips */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Tailor your CV for each job application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Use keywords from the job description</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Keep your CV to 1-2 pages maximum</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>Quantify achievements with numbers</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
