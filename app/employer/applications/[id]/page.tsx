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
import { ChevronLeft, Mail, Phone, FileText, ExternalLink } from "lucide-react";
import { updateApplicationStatus } from "../../jobs/actions";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await verifySession();
  if (!session) redirect("/signin");

  const { id } = await params;

  const application = await prisma.jobApplication.findUnique({
    where: { id },
    include: {
      jobSeekerProfile: {
        include: {
          user: true,
          experiences: true,
        },
      },
      jobPost: {
        include: {
          employer: true,
        },
      },
      resume: true,
    },
  });

  if (!application) notFound();

  // Verify ownership
  if (application.jobPost.employer.userId !== session.userId) {
    redirect("/employer/dashboard");
  }

  const handleStatusChange = async (status: any) => {
    "use server";
    await updateApplicationStatus(id, status);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/employer/jobs/${application.jobPostId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Job
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={application.jobSeekerProfile.profileImageUrl ?? undefined}
            />
            <AvatarFallback>
              {application.jobSeekerProfile.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {application.jobSeekerProfile.fullName}
            </h1>
            <p className="text-muted-foreground">
              Applied for: {application.jobPost.title}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className="text-lg px-4 py-1">
            {application.applicationStatus}
          </Badge>
          <p className="text-sm text-muted-foreground italic">
            Applied on {format(application.appliedAt, "MMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Experience */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{application.jobSeekerProfile.user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{application.jobSeekerProfile.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bio / Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-1">Education</p>
                <p className="text-sm">
                  {application.jobSeekerProfile.education ||
                    "No education info provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">Bio</p>
                <p className="text-sm whitespace-pre-wrap">
                  {application.jobSeekerProfile.bio || "No bio provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {application.jobSeekerProfile.experiences.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No experience listed.
                </p>
              ) : (
                <div className="space-y-6">
                  {application.jobSeekerProfile.experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-l-2 border-primary pl-4 py-1"
                    >
                      <p className="font-semibold">{exp.jobTitle}</p>
                      <p className="text-sm">{exp.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(exp.startDate, "MMM yyyy")} -{" "}
                        {exp.isCurrentlyWorkingHere
                          ? "Present"
                          : exp.endDate
                          ? format(exp.endDate, "MMM yyyy")
                          : "N/A"}
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions & Resume */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Application</CardTitle>
              <CardDescription>Update candidate status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {["REVIEWED", "INTERVIEWED", "OFFERED", "REJECTED"].map(
                  (status) => (
                    <form
                      key={status}
                      action={handleStatusChange.bind(null, status)}
                    >
                      <Button
                        variant={
                          application.applicationStatus === status
                            ? "default"
                            : "outline"
                        }
                        className="w-full justify-start"
                        type="submit"
                      >
                        Mark as{" "}
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </Button>
                    </form>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {application.resume.fileName}
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={application.resume.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
