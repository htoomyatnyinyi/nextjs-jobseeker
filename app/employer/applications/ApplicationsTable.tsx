"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import Link from "next/link";
import { Eye, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateApplicationStatus } from "../jobs/actions";

interface ApplicationsTableProps {
  initialApplications: any[];
}

export default function ApplicationsTable({
  initialApplications,
}: ApplicationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobFilter, setJobFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const uniqueJobs = Array.from(
    new Set(initialApplications.map((app) => app.jobPost.title))
  );

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    setUpdatingId(id);
    startTransition(async () => {
      await updateApplicationStatus(id, newStatus);
      setUpdatingId(null);
    });
  };

  const filteredApplications = initialApplications.filter((app) => {
    const matchesSearch =
      app.jobSeekerProfile.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.jobPost.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || app.applicationStatus === statusFilter;
    const matchesJob = jobFilter === "ALL" || app.jobPost.title === jobFilter;

    return matchesSearch && matchesStatus && matchesJob;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates or jobs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REVIEWED">Reviewed</SelectItem>
              <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
              <SelectItem value="OFFERED">Offered</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Jobs</SelectItem>
              {uniqueJobs.map((job) => (
                <SelectItem key={job} value={job}>
                  {job}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-premium bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Candidate
                  </th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Job Position
                  </th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Applied On
                  </th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Status (Quick Update)
                  </th>
                  <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/50">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <Filter className="h-8 w-8" />
                        <p>No applications match your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border group-hover:border-primary/50 transition-colors">
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
                          <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">
                              {app.jobSeekerProfile.fullName}
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">
                              {app.jobSeekerProfile.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold">
                          {app.jobPost.title}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium text-muted-foreground">
                          {format(new Date(app.appliedAt), "MMM dd, yyyy")}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={app.applicationStatus}
                            onValueChange={(val) =>
                              handleStatusUpdate(app.id, val)
                            }
                            disabled={updatingId === app.id}
                          >
                            <SelectTrigger className="h-8 w-[140px] text-[10px] font-bold uppercase">
                              {updatingId === app.id ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                              ) : null}
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="REVIEWED">Reviewed</SelectItem>
                              <SelectItem value="INTERVIEWED">
                                Interviewed
                              </SelectItem>
                              <SelectItem value="OFFERED">Offered</SelectItem>
                              <SelectItem value="REJECTED">Rejected</SelectItem>
                              <SelectItem value="WITHDRAWN">
                                Withdrawn
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Visual Indicator */}
                          <Badge
                            variant={
                              app.applicationStatus === "PENDING"
                                ? "secondary"
                                : app.applicationStatus === "REJECTED" ||
                                  app.applicationStatus === "WITHDRAWN"
                                ? "destructive"
                                : "default"
                            }
                            className="text-[8px] font-bold py-0 h-4 px-1"
                          >
                            Current
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="hover:bg-primary/10 hover:text-primary rounded-full px-3"
                        >
                          <Link href={`/employer/applications/${app.id}`}>
                            <span className="mr-2 text-xs font-bold uppercase tracking-wider">
                              Review
                            </span>
                            <Eye className="h-3.5 w-3.5" />
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

      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest text-right px-4">
        Showing {filteredApplications.length} of {initialApplications.length}{" "}
        applications
      </p>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { format } from "date-fns";
// import Link from "next/link";
// import { Eye, Search, Filter } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface ApplicationsTableProps {
//   initialApplications: any[];
// }

// export default function ApplicationsTable({
//   initialApplications,
// }: ApplicationsTableProps) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [jobFilter, setJobFilter] = useState("ALL");

//   const uniqueJobs = Array.from(
//     new Set(initialApplications.map((app) => app.jobPost.title))
//   );

//   const filteredApplications = initialApplications.filter((app) => {
//     const matchesSearch =
//       app.jobSeekerProfile.fullName
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       app.jobPost.title.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "ALL" || app.applicationStatus === statusFilter;
//     const matchesJob = jobFilter === "ALL" || app.jobPost.title === jobFilter;

//     return matchesSearch && matchesStatus && matchesJob;
//   });

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search candidates or jobs..."
//             className="pl-10"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <Select value={statusFilter} onValueChange={setStatusFilter}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="ALL">All Statuses</SelectItem>
//               <SelectItem value="PENDING">Pending</SelectItem>
//               <SelectItem value="REVIEWED">Reviewed</SelectItem>
//               <SelectItem value="INTERVIEWED">Interviewed</SelectItem>
//               <SelectItem value="OFFERED">Offered</SelectItem>
//               <SelectItem value="REJECTED">Rejected</SelectItem>
//             </SelectContent>
//           </Select>
//           <Select value={jobFilter} onValueChange={setJobFilter}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Filter by Job" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="ALL">All Jobs</SelectItem>
//               {uniqueJobs.map((job) => (
//                 <SelectItem key={job} value={job}>
//                   {job}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Card className="overflow-hidden border-none shadow-premium bg-background/50 backdrop-blur-sm">
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b bg-muted/30">
//                   <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
//                     Candidate
//                   </th>
//                   <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
//                     Job Position
//                   </th>
//                   <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
//                     Applied On
//                   </th>
//                   <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
//                     Status
//                   </th>
//                   <th className="p-4 font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-muted/50">
//                 {filteredApplications.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="p-12 text-center">
//                       <div className="flex flex-col items-center gap-2 opacity-50">
//                         <Filter className="h-8 w-8" />
//                         <p>No applications match your filters.</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredApplications.map((app) => (
//                     <tr
//                       key={app.id}
//                       className="hover:bg-muted/30 transition-colors group"
//                     >
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-9 w-9 border border-border group-hover:border-primary/50 transition-colors">
//                             <AvatarImage
//                               src={
//                                 app.jobSeekerProfile.profileImageUrl ??
//                                 undefined
//                               }
//                             />
//                             <AvatarFallback>
//                               {app.jobSeekerProfile.fullName.charAt(0)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex flex-col">
//                             <span className="font-bold text-sm tracking-tight">
//                               {app.jobSeekerProfile.fullName}
//                             </span>
//                             <span className="text-[10px] text-muted-foreground uppercase font-bold">
//                               {app.jobSeekerProfile.phone}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <p className="text-sm font-semibold">
//                           {app.jobPost.title}
//                         </p>
//                       </td>
//                       <td className="p-4">
//                         <span className="text-xs font-medium text-muted-foreground">
//                           {format(new Date(app.appliedAt), "MMM dd, yyyy")}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <Badge
//                           variant={
//                             app.applicationStatus === "PENDING"
//                               ? "secondary"
//                               : app.applicationStatus === "REJECTED"
//                               ? "destructive"
//                               : "default"
//                           }
//                           className="text-[10px] font-bold py-0.5 h-auto"
//                         >
//                           {app.applicationStatus}
//                         </Badge>
//                       </td>
//                       <td className="p-4 text-right">
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           asChild
//                           className="hover:bg-primary/10 hover:text-primary rounded-full px-3"
//                         >
//                           <Link href={`/employer/applications/${app.id}`}>
//                             <span className="mr-2 text-xs font-bold uppercase tracking-wider">
//                               Review
//                             </span>
//                             <Eye className="h-3.5 w-3.5" />
//                           </Link>
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest text-right px-4">
//         Showing {filteredApplications.length} of {initialApplications.length}{" "}
//         applications
//       </p>
//     </div>
//   );
// }
