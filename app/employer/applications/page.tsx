import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
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
import { Eye, ChevronLeft, Users } from "lucide-react";

export default async function EmployerApplicationsPage() {
  const session = await verifySession();
  if (!session) redirect("/signin");

  const applications = await prisma.jobApplication.findMany({
    where: { jobPost: { employer: { userId: session.userId } } },
    include: {
      jobSeekerProfile: true,
      jobPost: { select: { title: true } },
    },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/employer/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          All Applications
        </h1>
        <p className="text-muted-foreground">
          Manage all candidates who applied to your job postings.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 font-semibold">Candidate</th>
                  <th className="p-4 font-semibold">Job Title</th>
                  <th className="p-4 font-semibold">Applied On</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                app.jobSeekerProfile.profileImageUrl ??
                                undefined
                              }
                            />
                            <AvatarFallback>
                              {app.jobSeekerProfile.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {app.jobSeekerProfile.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{app.jobPost.title}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(app.appliedAt, "MMM d, yyyy")}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            app.applicationStatus === "PENDING"
                              ? "secondary"
                              : app.applicationStatus === "REJECTED"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {app.applicationStatus}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/employer/applications/${app.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
