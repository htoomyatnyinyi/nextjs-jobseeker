// app/dashboard/page.tsx
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
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
import { format } from "date-fns";

// Icons (use any icon library, e.g., lucide-react)
import {
  Briefcase,
  Building2,
  FileText,
  Heart,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import FileUploadForm from "../resume/FileUploadForm";

const DashboardPage = async () => {
  const session = await verifySession();

  if (!session?.userId) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (!user) redirect("/signin");

  // === JOB SEEKER DASHBOARD ===
  if (user.role === "USER") {
    const [profile, resumes, applications, savedJobs] = await Promise.all([
      prisma.jobSeekerProfile.findUnique({
        where: { userId: user.id },
        include: {
          experiences: {
            orderBy: { startDate: "desc" },
          },
        },
      }),
      prisma.resume.findMany({
        where: { jobSeekerProfile: { userId: user.id } },
        orderBy: { uploadedAt: "desc" },
      }),
      prisma.jobApplication.findMany({
        where: { jobSeekerProfile: { userId: user.id } },
        include: {
          jobPost: {
            select: {
              title: true,
              employer: { select: { companyName: true } },
              location: true,
              employmentType: true,
            },
          },
          resume: { select: { fileName: true } },
        },
        orderBy: { appliedAt: "desc" },
      }),
      prisma.savedJob.findMany({
        where: { jobSeekerProfile: { userId: user.id } },
        include: {
          jobPost: {
            select: {
              title: true,
              salaryMin: true,
              location: true,
              employer: { select: { companyName: true } },
            },
          },
        },
        orderBy: { savedAt: "desc" },
      }),
    ]);

    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user.username}!
            </h1>
            <p className="text-muted-foreground">
              Manage your job search in one place.
            </p>
          </div>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>

        <Separator />

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.profileImageUrl || undefined} />
                <AvatarFallback>
                  {profile?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  {profile?.fullName || "Complete Your Profile"}
                </CardTitle>
                <CardDescription>
                  {profile?.bio || "Add a bio to increase your chances!"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.address || "No location"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{profile?.experiences.length} Experience(s)</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{resumes.length} Resume(s)</span>
              </div>
            </div>
            <Button
              asChild
              className="mt-4"
              variant={profile ? "outline" : "default"}
            >
              <Link href="/user/dashboard/profile">
                {profile ? "Edit Profile" : "Create Profile"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">
                {
                  applications.filter((a) => a.applicationStatus === "PENDING")
                    .length
                }
                pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedJobs.length}</div>
              <p className="text-xs text-muted-foreground">
                Bookmarked opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
              <p className="text-xs text-muted-foreground">Ready to apply</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  applications.filter(
                    (a) => a.applicationStatus === "INTERVIEWED"
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest job applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No applications yet.{" "}
                <Link href="/jobs" className="underline">
                  Start applying!
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{app.jobPost.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {app.jobPost.employer.companyName} •{" "}
                        {app.jobPost.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
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
                      <span className="text-xs text-muted-foreground">
                        {format(app.appliedAt, "MMM d")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {applications.length > 5 && (
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href="/dashboard/applications">View All</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
            <CardDescription>Jobs you bookmarked</CardDescription>
          </CardHeader>
          <CardContent>
            {savedJobs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No saved jobs.{" "}
                <Link href="/jobs" className="underline">
                  Explore jobs!
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.slice(0, 4).map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <Heart
                      className="h-5 w-5 text-red-500 mt-1"
                      fill="currentColor"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {saved.jobPost.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {saved.jobPost.employer.companyName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {saved.jobPost.location || "Remote"}
                        {saved.jobPost.salaryMin && (
                          <>
                            <span>•</span>
                            <span>
                              ${saved.jobPost.salaryMin.toString()}/yr
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {savedJobs.length > 4 && (
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link href="/dashboard/saved">View All Saved</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // === EMPLOYER DASHBOARD ===
  if (user.role === "EMPLOYER") {
    const [profile, jobPosts, applications] = await Promise.all([
      prisma.employerProfile.findUnique({
        where: { userId: user.id },
      }),
      prisma.jobPost.findMany({
        where: { employer: { userId: user.id } },
        orderBy: { postedAt: "desc" },
        include: {
          _count: { select: { jobApplications: true } },
        },
      }),
      prisma.jobApplication.findMany({
        where: { jobPost: { employer: { userId: user.id } } },
        include: {
          jobSeekerProfile: {
            select: { fullName: true, profileImageUrl: true },
          },
          jobPost: { select: { title: true } },
        },
        orderBy: { appliedAt: "desc" },
      }),
    ]);

    const totalApplications = applications.length;
    const activeJobs = jobPosts.filter((j) => j.isActive).length;

    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Employer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your job postings and applicants.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/post-job">Post New Job</Link>
          </Button>
        </div>

        <Separator />

        {/* Company Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.logoUrl || undefined} />
                <AvatarFallback>
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>
                  {profile?.companyName || "Set Up Company"}
                </CardTitle>
                <CardDescription>
                  {profile?.companyDescription ||
                    "Add company details to attract talent."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={profile?.stats === "ACTIVE" ? "default" : "secondary"}
              >
                {profile?.stats || "Pending"}
              </Badge>
              <Badge variant="outline">
                {profile?.subscriptionPlan || "Free"}
              </Badge>
            </div>
            <Button
              asChild
              className="mt-4"
              variant={profile ? "outline" : "default"}
            >
              <Link href="/dashboard/company">
                {profile ? "Edit Company" : "Create Company Profile"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApplications}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Jobs Posted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobPosts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Your Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            {jobPosts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No jobs posted yet.{" "}
                <Link href="/dashboard/post-job" className="underline">
                  Post your first job!
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {jobPosts.map((job) => (
                  <div
                    key={job.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {job._count.jobApplications} application(s)
                        {" • "}
                        Posted {format(job.postedAt, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/dashboard/jobs/${job.id}`}>Manage</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback
  return <div>Role not supported yet.</div>;
};

export default DashboardPage;
