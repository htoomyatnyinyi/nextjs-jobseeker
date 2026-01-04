import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Users, FileStack } from "lucide-react";
import ApplicationsTable from "./ApplicationsTable";

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
    <div className="container mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 text-muted-foreground hover:text-primary"
          >
            <Link href="/employer/dashboard">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <FileStack className="h-8 w-8" />
              </div>
              Candidate Applications
            </h1>
            <p className="text-muted-foreground text-lg">
              Review and manage all applicants across your {applications.length}{" "}
              total applications.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ApplicationsTable initialApplications={applications} />
      </div>
    </div>
  );
}
