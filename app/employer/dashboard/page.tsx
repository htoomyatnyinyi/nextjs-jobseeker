// app/dashboard/employer/page.tsx
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Building2,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

const EmployerDashboard = async () => {
  const session = await verifySession();
  if (!session?.userId) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true },
  });

  if (!user || user.role !== "EMPLOYER") redirect("/dashboard");

  // -----------------------------------------------------------------
  // 1. Fetch everything in parallel
  // -----------------------------------------------------------------
  const [profile, jobPosts, applications] = await Promise.all([
    // Company profile
    prisma.employerProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
        companyDescription: true,
        stats: true,
        subscriptionPlan: true,
        city: true,
        country: true,
      },
    }),

    // All job posts belonging to this employer
    prisma.jobPost.findMany({
      where: { employer: { userId: user.id } },
      orderBy: { postedAt: "desc" },
      include: {
        _count: { select: { jobApplications: true } },
      },
    }),

    // All applications received on any of the employer’s jobs
    prisma.jobApplication.findMany({
      where: { jobPost: { employer: { userId: user.id } } },
      include: {
        jobSeekerProfile: {
          select: {
            fullName: true,
            profileImageUrl: true,
          },
        },
        jobPost: { select: { title: true } },
        resume: { select: { fileName: true } },
      },
      orderBy: { appliedAt: "desc" },
      take: 10, // limit for the “Recent Applicants” section
    }),
  ]);

  // -----------------------------------------------------------------
  // 2. Derived stats
  // -----------------------------------------------------------------
  const activeJobs = jobPosts.filter((j) => j.isActive).length;
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(
    (a) => a.applicationStatus === "PENDING"
  ).length;

  // -----------------------------------------------------------------
  // 3. Render
  // -----------------------------------------------------------------
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* ==== HEADER ==== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage postings, view applicants, and grow your team.
          </p>
        </div>
        <Button asChild>
          <Link href="/employer/jobs">Post New Job</Link>
        </Button>
      </div>

      <Separator />

      {/* ==== COMPANY CARD ==== */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.logoUrl ?? undefined} />
              <AvatarFallback>
                <Building2 className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{profile?.companyName || "Set Up Company"}</CardTitle>
              <CardDescription>
                {profile?.companyDescription ||
                  "Add a description to attract top talent."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={
                profile?.stats === "ACTIVE"
                  ? "default"
                  : profile?.stats === "PENDING"
                  ? "secondary"
                  : "destructive"
              }
            >
              {profile?.stats ?? "Pending"}
            </Badge>
            <Badge variant="outline">
              {profile?.subscriptionPlan ?? "Free"} Plan
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            {profile?.city && profile?.country
              ? `${profile.city}, ${profile.country}`
              : "No location set"}
          </div>

          <Button
            asChild
            variant={profile ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            <Link href="/employer/profile">
              {profile ? "Edit Company" : "Create Company Profile"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* ==== STATS GRID ==== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" />
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Total Jobs Posted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobPosts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* ==== RECENT JOB POSTS ==== */}
      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>
          <CardDescription>
            {jobPosts.length === 0
              ? "You haven’t posted any jobs yet."
              : "Click “Manage” to edit or view applicants."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No jobs posted.{" "}
                <Link
                  href="/dashboard/employer/post-job"
                  className="underline font-medium"
                >
                  Post your first job!
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobPosts.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg gap-3"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {job._count.jobApplications} application(s) • Posted{" "}
                      {format(job.postedAt, "MMM d, yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={job.isActive ? "default" : "secondary"}>
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/employer/jobs/${job.id}`}>Manage</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {jobPosts.length > 5 && (
            <Button asChild variant="ghost" className="w-full mt-4">
              <Link href="/employer/jobs">View All Jobs</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ==== RECENT APPLICANTS ==== */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applicants</CardTitle>
          <CardDescription>
            Latest candidates who applied to your jobs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No applications yet.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={app.jobSeekerProfile.profileImageUrl ?? undefined}
                      />
                      <AvatarFallback>
                        {app.jobSeekerProfile.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {app.jobSeekerProfile.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {app.jobPost.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        app.applicationStatus === "PENDING"
                          ? "secondary"
                          : app.applicationStatus === "INTERVIEWED"
                          ? "default"
                          : app.applicationStatus === "OFFERED"
                          ? "default"
                          : app.applicationStatus === "REJECTED"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {app.applicationStatus}
                    </Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/employer/applications/${app.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {applications.length === 10 && (
            <Button asChild variant="ghost" className="w-full mt-4">
              <Link href="/employer/applications">View All Applications</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDashboard;
