import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";
import { Eye, Mail, FileText, ChevronLeft } from "lucide-react";

export default async function JobDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await verifySession();
  if (!session) redirect("/signin");

  const { id } = await params;

  const job = await prisma.jobPost.findUnique({
    where: { id },
    include: {
      employer: true,
      jobApplications: {
        include: {
          jobSeekerProfile: true,
          resume: true,
        },
        orderBy: { appliedAt: "desc" },
      },
      responsibilities: true,
      requirements: true,
    },
  });

  if (!job) notFound();

  // Verify ownership
  if (job.employer.userId !== session.userId) {
    redirect("/employer/dashboard");
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/employer/jobs">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="text-muted-foreground">
            {job.category} • {job.location}
          </p>
        </div>
        <Badge variant={job.isActive ? "default" : "secondary"}>
          {job.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{job.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Salary Range</p>
                  <p>
                    ${job.salaryMin.toLocaleString()} - $
                    {job.salaryMax?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Employment Type</p>
                  <p>{job.employmentType}</p>
                </div>
                <div>
                  <p className="font-semibold">Posted On</p>
                  <p>{format(job.postedAt, "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="font-semibold">Deadline</p>
                  <p>
                    {job.applicationDeadLine
                      ? format(job.applicationDeadLine, "MMM d, yyyy")
                      : "None"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicants ({job.jobApplications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {job.jobApplications.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  No applications yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {job.jobApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              app.jobSeekerProfile.profileImageUrl ?? undefined
                            }
                          />
                          <AvatarFallback>
                            {app.jobSeekerProfile.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {app.jobSeekerProfile.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Applied {format(app.appliedAt, "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{app.applicationStatus}</Badge>
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
            </CardContent>
          </Card>
        </div>

        {/* Requirements & Responsibilities */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {job.responsibilities.map((r) => (
                  <li key={r.id}>{r.responsibility}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {job.requirements.map((r) => (
                  <li key={r.id}>{r.requirement}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
