import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import EditForm from "./EditForm";
import DeleteForm from "./DeleteForm";
import Link from "next/link";
import { DateFilter } from "@/lib/common/DateTime";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Phone,
  GraduationCap,
  Info,
} from "lucide-react";

const JobSeekerProfilePage = async () => {
  const session = await verifySession();

  const data = await prisma.user.findUnique({
    where: { id: session?.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      jobSeekerProfile: true,
    },
  });

  const dateOnly = DateFilter({ date: data?.jobSeekerProfile?.dateOfBirth });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-in fade-in duration-700">
      {/* Header Card */}
      <div className=" border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20  rounded-full flex items-center justify-center text-sky-600">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-2xl font-bold ">
              {data?.jobSeekerProfile?.fullName || data?.username}
            </h1>
            <p className="text-slate-500 flex items-center gap-1.5 text-sm">
              <Mail size={14} /> {data?.email}
            </p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-100">
                {data?.role}
              </span>
              {data?.verified && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <EditForm data={data} />
          <Link
            href={`/profile/${data?.id}`}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            View Public Profile
          </Link>
        </div>
      </div>

      {/* Profile Details Grid */}
      {data?.jobSeekerProfile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info size={18} className="text-sky-500" /> Professional Bio
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {data.jobSeekerProfile.bio ||
                  "No bio added yet. Tell employers about yourself!"}
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-sky-500" /> Education
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {data.jobSeekerProfile.education ||
                  "No education details provided."}
              </p>
            </div>
          </div>

          {/* Quick Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">
                Personal Details
              </h3>
              <div className="space-y-4">
                <DetailRow
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={data.jobSeekerProfile.phone}
                />
                <DetailRow
                  icon={<Calendar size={14} />}
                  label="Birthday"
                  value={dateOnly}
                />
                <DetailRow
                  icon={<User size={14} />}
                  label="Gender"
                  value={data.jobSeekerProfile.gender}
                />
                <DetailRow
                  icon={<MapPin size={14} />}
                  label="Address"
                  value={data.jobSeekerProfile.address}
                />
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <DeleteForm profile_id={data.jobSeekerProfile.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-700 mt-1">
        {value || "Not set"}
      </p>
    </div>
  </div>
);

export default JobSeekerProfilePage;

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import EditForm from "./EditForm";
// import DeleteForm from "./DeleteForm";
// import Link from "next/link";
// import { DateFilter } from "@/lib/common/DateTime";

// const page = async () => {
//   const session = await verifySession();

//   const data = await prisma.user.findFirst({
//     where: { id: session?.userId },

//     // include: {
//     //   jobSeekerProfile: true,
//     // },

//     select: {
//       id: true,
//       username: true,
//       email: true,
//       role: true,
//       verified: true,
//       lastSignin: true,
//       jobSeekerProfile: true,
//       // jobSeekerProfile: {
//       // select: {
//       //   id: true,
//       //   userId: true,
//       //   fullName: true,
//       //   firstName: true,
//       //   lastName: true,
//       //   phone: true,
//       //   gender: true,
//       //   dateOfBirth: true,
//       //   address: true,
//       //   bio: true,
//       //   education: true,
//       //   profileImageUrl: true,
//       //   coverImageUrl: true,
//       // },
//       // },
//     },
//   });

//   // same as above using DateFilter component
//   const dateOnly = DateFilter({ date: data?.jobSeekerProfile?.dateOfBirth });
//   // // 1. Get the date value directly (it will be a Date object or null)
//   // const dateOfBirthPrisma = data?.jobSeekerProfile?.dateOfBirth;

//   // // 2. Conditionally process the date only if it exists
//   // const dateOnly = dateOfBirthPrisma
//   //   ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
//   //   : ""; // If null, set it to an empty string

//   return (
//     <div className="felx flex-col p-2 m-1 ">
//       <p>{data?.username}</p>
//       <p>{data?.email}</p>
//       <p>{data?.role}</p>
//       <p>{data?.verified}</p>
//       {data?.jobSeekerProfile?.id && (
//         <div className="flex flex-col border p-2 m-1 text-sky-400">
//           <div className="flex justify-between">
//             <h1 className="text-3xl p-2 m-1 uppercase">Profile Data</h1>
//             <DeleteForm profile_id={data?.jobSeekerProfile?.id} />
//           </div>
//           <div>
//             <p>{data?.jobSeekerProfile?.id} jobSeekerProfile</p>
//             <p>{data?.jobSeekerProfile?.userId} userId</p>
//             <p>{data?.jobSeekerProfile?.fullName}</p>
//             <p>{data?.jobSeekerProfile?.firstName}</p>
//             <p>{data?.jobSeekerProfile?.lastName}</p>
//             <p>{data?.jobSeekerProfile?.phone}</p>

//             <p>{dateOnly}</p>
//             <p>{data?.jobSeekerProfile?.gender}</p>
//             <p>{data?.jobSeekerProfile?.address}</p>
//             <p>{data?.jobSeekerProfile?.bio}</p>
//             <p>{data?.jobSeekerProfile?.education}</p>
//           </div>
//         </div>
//       )}

//       <EditForm data={data} />
//       <Link href={`/profile/${data?.id}/edit`} className="bg-red-500 p-2 m-1">
//         Edit
//       </Link>
//       <Link href={`/profile/${data?.id}`} className="bg-red-500 p-2 m-1">
//         View
//       </Link>
//     </div>
//   );
// };

// export default page;
