// app/dashboard/admin/page.tsx
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Users,
  Building2,
  Briefcase,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";

// Server Action: Change user role
async function updateUserRole(userId: string, newRole: string) {
  "use server";
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
  });
}

// Server Action: Approve/Reject employer
async function updateEmployerStatus(
  profileId: string,
  status: "ACTIVE" | "REJECTED"
) {
  "use server";
  await prisma.employerProfile.update({
    where: { id: profileId },
    data: { stats: status },
  });
}

const AdminDashboard = async () => {
  const session = await verifySession();
  if (!session?.userId) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, username: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // --------------------------------------------------------------
  // Fetch all admin-relevant data in parallel
  // --------------------------------------------------------------
  const [
    stats,
    recentUsers,
    pendingEmployers,
    recentJobPosts,
    recentApplications,
  ] = await Promise.all([
    // 1. Overview Stats
    Promise.all([
      prisma.user.count(),
      prisma.employerProfile.count(),
      prisma.jobPost.count(),
      prisma.jobApplication.count(),
      prisma.employerProfile.count({ where: { stats: "PENDING" } }),
    ]).then(([users, employers, jobs, apps, pending]) => ({
      users,
      employers,
      jobs,
      apps,
      pendingEmployers: pending,
    })),

    // 2. Recent Users (for role management)
    prisma.user.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        jobSeekerProfile: { select: { fullName: true } },
        employerProfile: { select: { companyName: true } },
      },
    }),

    // 3. Pending Employer Verifications
    prisma.employerProfile.findMany({
      where: { stats: "PENDING" },
      take: 5,
      include: {
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),

    // 4. Recent Job Posts (for moderation)
    prisma.jobPost.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        employer: { select: { companyName: true } },
      },
    }),

    // 5. Recent Applications
    prisma.jobApplication.findMany({
      take: 5,
      orderBy: { appliedAt: "desc" },
      include: {
        jobPost: { select: { title: true } },
        jobSeekerProfile: { select: { fullName: true } },
      },
    }),
  ]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Monitor platform activity and manage users.
          </p>
        </div>
      </div>

      <Separator />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              Employers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Job Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apps}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEmployers}</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Manage roles and access</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/admin/users">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentUsers.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No users yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {u.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{u.username}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>

                  <form action={updateUserRole.bind(null, u.id)}>
                    <Select defaultValue={u.role} name="role">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">Job Seeker</SelectItem>
                        <SelectItem value="EMPLOYER">Employer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="submit" size="sm" className="ml-2">
                      Update
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Employer Verifications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Employer Verifications</CardTitle>
          <CardDescription>Review and approve company profiles</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingEmployers.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No pending verifications.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingEmployers.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={emp.logoUrl ?? undefined} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{emp.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <form
                      action={updateEmployerStatus.bind(null, emp.id, "ACTIVE")}
                    >
                      <Button size="sm" variant="default">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </form>
                    <form
                      action={updateEmployerStatus.bind(
                        null,
                        emp.id,
                        "REJECTED"
                      )}
                    >
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Job Posts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Job Posts</CardTitle>
              <CardDescription>Monitor new listings</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/admin/jobs">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentJobPosts.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No jobs yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentJobPosts.map((job) => (
                <div
                  key={job.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.employer.companyName} •{" "}
                      {format(job.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/dashboard/admin/jobs/${job.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentApplications.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No applications.
            </p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex justify-between items-center p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {app.jobSeekerProfile.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Applied to: {app.jobPost.title}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {format(app.appliedAt, "MMM d")}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
// import Link from "next/link";

// const page = () => {
//   return (
//     <div>
//       <div>
//         <h1>User Manage Link</h1>
//         <p>
//           Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est ducimus,
//           voluptatum laborum nobis sapiente doloremque, nisi nemo inventore
//           nihil minus tenetur! Tempore voluptate, at voluptatem accusamus
//           dolorem illum quasi earum?
//         </p>
//         <Link href="/admin/user">User Manage</Link>
//       </div>
//       <div>
//         <h1>Job Manage Link</h1>
//         <p>
//           Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est ducimus,
//           voluptatum laborum nobis sapiente doloremque, nisi nemo inventore
//           nihil minus tenetur! Tempore voluptate, at voluptatem accusamus
//           dolorem illum quasi earum?
//         </p>
//         <Link href="/admin/job">Job Manage</Link>
//       </div>
//     </div>
//   );
// };

// export default page;
