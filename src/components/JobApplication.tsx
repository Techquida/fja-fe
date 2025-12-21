import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Send,
  FileText,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import {
  auth,
  cvService,
  coverLetterService,
  jobApplicationService,
} from "../lib/mockBackend";
import { toast } from "sonner";
import type { CVDocument, CoverLetter, JobApplication } from "../types";

export function JobApplication() {
  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [cvs, setCvs] = useState<CVDocument[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedTab, setSelectedTab] = useState<"track" | "new">("track");

  const user = auth.getCurrentUser();

  useEffect(() => {
    if (user) {
      const allApps = jobApplicationService.getAll(user.id);
      setApplications(allApps);
      setCvs(
        cvService.getAll(user.id).filter((cv) => cv.status === "completed")
      );
      setCoverLetters(coverLetterService.getAll(user.id));
    }
  }, [user]);

  const getStatusIcon = (status: JobApplication["status"]) => {
    switch (status) {
      case "applied":
        return <Send className="w-4 h-4" />;
      case "reviewing":
        return <Clock className="w-4 h-4" />;
      case "interview":
        return <CheckCircle className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "reviewing":
        return "bg-yellow-100 text-yellow-700";
      case "interview":
        return "bg-purple-100 text-purple-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusUpdate = (
    appId: string,
    newStatus: JobApplication["status"]
  ) => {
    jobApplicationService.updateStatus(appId, newStatus);
    setApplications(jobApplicationService.getAll(user!.id));
    toast.success("Application status updated!");
  };

  const stats = {
    total: applications.length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    interview: applications.filter((a) => a.status === "interview").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  return (
    <div>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track Your Job Applications
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay organized and never miss a follow-up — all your applications in
            one place
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            size="lg"
            variant={selectedTab === "track" ? "default" : "outline"}
            onClick={() => setSelectedTab("track")}
          >
            My Applications ({applications.length})
          </Button>
          <Button
            size="lg"
            variant={selectedTab === "new" ? "default" : "outline"}
            onClick={() => setSelectedTab("new")}
          >
            + Track New Application
          </Button>
        </div>

        {/* Track Tab */}
        {selectedTab === "track" && (
          <div className="space-y-6">
            {applications.length > 0 ? (
              applications.map((app) => (
                <Card
                  key={app.id}
                  className="p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold">{app.jobTitle}</h3>
                        <Badge
                          className={`text-base px-4 py-1 ${getStatusColor(
                            app.status
                          )}`}
                        >
                          <span className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            {app.status.charAt(0).toUpperCase() +
                              app.status.slice(1)}
                          </span>
                        </Badge>
                      </div>

                      <p className="text-lg text-gray-700 mb-2">
                        {app.company}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>
                          Applied:{" "}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        {app.cvId && <span>• CV Attached</span>}
                        {app.coverLetterId && (
                          <span>• Cover Letter Attached</span>
                        )}
                      </div>

                      {app.notes && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 italic">
                            Notes: {app.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="md:w-64">
                      <Label className="text-sm font-medium mb-2 block">
                        Update Status
                      </Label>
                      <Select
                        value={app.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(
                            app.id,
                            value as JobApplication["status"]
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="reviewing">
                            Under Review
                          </SelectItem>
                          <SelectItem value="interview">
                            Interview Scheduled
                          </SelectItem>
                          <SelectItem value="accepted">
                            Offer Received
                          </SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-16 text-center">
                <Send className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start tracking your job applications to stay organized and
                  increase your chances of success.
                </p>
                <Button size="lg" onClick={() => setSelectedTab("new")}>
                  Track Your First Application
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* New Application Tab */}
        {selectedTab === "new" && (
          <Card className="p-12 text-center max-w-3xl mx-auto">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Coming Soon!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Full application tracking form with CV & cover letter attachment
              is in development.
            </p>
            <p className="text-gray-500 mb-10">
              For now, you can manually add applications by updating status in
              the list above.
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setSelectedTab("track")}
            >
              Go to My Applications
            </Button>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {stats.total}
            </div>
            <div className="text-gray-700 font-medium">Total Applications</div>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-amber-100">
            <div className="text-4xl font-bold text-yellow-700 mb-2">
              {stats.reviewing}
            </div>
            <div className="text-gray-700 font-medium">Under Review</div>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {stats.interview}
            </div>
            <div className="text-gray-700 font-medium">Interviews</div>
          </Card>

          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="text-4xl font-bold text-green-700 mb-2">
              {stats.accepted}
            </div>
            <div className="text-gray-700 font-medium">Offers Received</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
