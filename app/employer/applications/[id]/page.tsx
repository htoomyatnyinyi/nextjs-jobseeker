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
import {
  ChevronLeft,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
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
          experiences: {
            orderBy: { startDate: "desc" },
          },
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

  const statusIcons: Record<string, any> = {
    PENDING: <Clock className="h-4 w-4" />,
    REVIEWED: <AlertCircle className="h-4 w-4" />,
    INTERVIEWED: <User className="h-4 w-4" />,
    OFFERED: <CheckCircle2 className="h-4 w-4" />,
    REJECTED: <XCircle className="h-4 w-4" />,
    WITHDRAWN: <XCircle className="h-4 w-4" />,
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b pb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/employer/jobs/${application.jobPostId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Job Post
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
          Application ID: {application.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Profile Card & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-t-4 border-t-primary">
            <CardContent className="pt-8 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10">
                <AvatarImage
                  src={
                    application.jobSeekerProfile.profileImageUrl ?? undefined
                  }
                />
                <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                  {application.jobSeekerProfile.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-bold">
                {application.jobSeekerProfile.fullName}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                Candidate for {application.jobPost.title}
              </p>

              <div className="flex flex-col gap-2 w-full">
                <Badge
                  variant={
                    application.applicationStatus === "REJECTED" ||
                    application.applicationStatus === "WITHDRAWN"
                      ? "destructive"
                      : "outline"
                  }
                  className="w-full justify-center py-1.5 flex gap-2"
                >
                  {statusIcons[application.applicationStatus] || (
                    <Clock className="h-4 w-4" />
                  )}
                  {application.applicationStatus}
                </Badge>
                <p className="text-[10px] text-muted-foreground italic">
                  Applied {format(application.appliedAt, "MMM dd, yyyy")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Contact Details
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-full bg-primary/5 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Email
                  </p>
                  <p className="truncate font-medium">
                    {application.jobSeekerProfile.user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 rounded-full bg-primary/5 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Phone
                  </p>
                  <p className="font-medium">
                    {application.jobSeekerProfile.phone}
                  </p>
                </div>
              </div>
              {application.jobSeekerProfile.address && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-full bg-primary/5 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      Location
                    </p>
                    <p className="font-medium">
                      {application.jobSeekerProfile.address}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Update Status
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 pt-2">
              {[
                "PENDING",
                "REVIEWED",
                "INTERVIEWED",
                "OFFERED",
                "REJECTED",
                "WITHDRAWN",
              ].map((status) => (
                <form
                  key={status}
                  action={handleStatusChange.bind(null, status)}
                >
                  <Button
                    variant={
                      application.applicationStatus === status
                        ? "secondary"
                        : "ghost"
                    }
                    className={`w-full justify-start h-9 text-xs font-semibold ${
                      application.applicationStatus === status
                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        : ""
                    }`}
                    type="submit"
                  >
                    <span className="mr-2">{statusIcons[status]}</span>
                    Mark as {status.charAt(0) + status.slice(1).toLowerCase()}
                  </Button>
                </form>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Middle/Right Columns: Profile Details & Resume */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bio Summary */}
            <Card className="md:col-span-2">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {application.jobSeekerProfile.bio ||
                    "No professional summary provided."}
                </p>
              </CardContent>
            </Card>

            {/* Education & Personal */}
            <Card>
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm font-medium">
                  {application.jobSeekerProfile.education ||
                    "No education info provided."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  Personal Info
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Gender
                  </p>
                  <p className="text-sm font-medium">
                    {application.jobSeekerProfile.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">
                    Date of Birth
                  </p>
                  <p className="text-sm font-medium">
                    {application.jobSeekerProfile.dateOfBirth
                      ? format(
                          new Date(application.jobSeekerProfile.dateOfBirth),
                          "MMM dd, yyyy"
                        )
                      : "Not specified"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="md:col-span-2">
              <CardHeader className="border-b bg-muted/30 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {application.jobSeekerProfile.experiences.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No work experience listed.
                  </p>
                ) : (
                  <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                    {application.jobSeekerProfile.experiences.map((exp) => (
                      <div key={exp.id} className="pl-8 relative">
                        <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-base">
                            {exp.jobTitle}
                          </h4>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono"
                          >
                            {format(exp.startDate, "MMM yyyy")} -{" "}
                            {exp.isCurrentlyWorkingHere
                              ? "Present"
                              : exp.endDate
                              ? format(exp.endDate, "MMM yyyy")
                              : "N/A"}
                          </Badge>
                        </div>
                        <p className="text-sm text-primary font-medium mb-2">
                          {exp.companyName}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resume File */}
            <Card className="md:col-span-2">
              <CardHeader className="border-b bg-muted/30 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Attached Resume
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-2"
                  asChild
                >
                  <a
                    href={application.resume.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open Original
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 border-2 border-dashed rounded-xl bg-muted/10">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {application.resume.fileName}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {application.resume.fileType.split("/")[1] ||
                          "Document"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg shadow-primary/20"
                    asChild
                  >
                    <a
                      href={application.resume.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Resume
                    </a>
                  </Button>
                </div>

                {/* PDF Preview if it's a PDF */}
                {application.resume.fileType === "application/pdf" && (
                  <div className="mt-6 aspect-[4/5] w-full border rounded-xl overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center">
                    <iframe
                      src={`${application.resume.filePath}#toolbar=0`}
                      className="w-full h-full"
                      title="Resume Preview"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
