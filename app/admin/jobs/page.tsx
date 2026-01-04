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
import { format } from "date-fns";
import Link from "next/link";
import { Briefcase, Eye, Trash2, ChevronLeft, Building2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminJobsPage() {
  const session = await verifySession();
  if (!session?.userId) redirect("/signin");

  const admin = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!admin || admin.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const jobs = await prisma.jobPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      employer: { select: { companyName: true } },
      _count: { select: { jobApplications: true } },
    },
  });

  async function deleteJob(jobId: string) {
    "use server";
    await prisma.jobPost.delete({ where: { id: jobId } });
    revalidatePath("/admin/jobs");
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Platform Job Posts
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all job listings across the platform.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 font-semibold">Job Title</th>
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Apps</th>
                  <th className="p-4 font-semibold">Posted</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-4 font-medium">{job.title}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {job.employer.companyName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">
                        {job._count.jobApplications}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {format(job.createdAt, "MMM d, yyyy")}
                    </td>
                    <td className="p-4">
                      <Badge variant={job.isActive ? "default" : "secondary"}>
                        {job.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          title="View on Site"
                        >
                          <Link href={`/jobs/${job.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deleteJob.bind(null, job.id)}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
