import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import EditEmployerForm from "./EditEmployerForm";
import DeleteEmployerForm from "./DeleteEmployerForm";
import {
  Mail,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
} from "lucide-react"; // Optional: icons make it pop

const EmployerProfilePage = async () => {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      lastSignin: true,
      employerProfile: true,
    },
  });

  console.log(user, "check");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight ">Settings</h1>
          <p className="">Manage your account and company information.</p>
        </div>
        {/* {!user?.employerProfile && (
          <div className="flex gap-3">
            <EditEmployerForm />
          </div>
        )} */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Summary */}
        <div className="space-y-6">
          <div className=" border rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold  uppercase tracking-wider mb-4">
              Account
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xl font-bold ">{user?.username}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.verified
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {user?.verified ? "Verified Account" : "Pending Verification"}
                </span>
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium border">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Company Details */}
        <div className="lg:col-span-2 space-y-6">
          {user?.employerProfile ? (
            <div className=" border rounded-xl overflow-hidden shadow-sm">
              <div className=" border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-sky-600" />
                  <h3 className="font-semibold ">Company Profile</h3>
                </div>
                <DeleteEmployerForm profile_id={user.employerProfile.id} />
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem
                  label="Company Name"
                  value={user.employerProfile.companyName}
                />
                <DetailItem
                  label="Industry"
                  value={user.employerProfile.industry}
                />
                <DetailItem
                  label="Business Email"
                  value={user.employerProfile.companyEmail}
                />
                <DetailItem label="Phone" value={user.employerProfile.phone} />

                <div className="md:col-span-2">
                  <DetailItem
                    label="Description"
                    value={user.employerProfile.companyDescription}
                    className="italic text-slate-600"
                  />
                </div>

                <div className="md:col-span-2 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailItem
                    label="Country"
                    value={user.employerProfile.country}
                    icon={<MapPin className="w-3 h-3" />}
                  />
                  <DetailItem
                    label="State/Region"
                    value={user.employerProfile.state}
                  />
                  <DetailItem
                    label="Address"
                    value={user.employerProfile.address}
                  />
                </div>
              </div>

              <div className=" px-6 py-3 text-[10px]  font-mono border-t">
                ID: {user.employerProfile.id}
              </div>
            </div>
          ) : (
            <div>
              <div className="border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center">
                <Building2 className="w-12 h-12 mb-4" />
                <p className="font-medium">No employer profile found.</p>
                <p className="text-sm">
                  Complete your profile to start posting jobs.
                </p>
              </div>
              {!user?.employerProfile && (
                <div className="flex gap-3">
                  <EditEmployerForm />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for clean layout
const DetailItem = ({ label, value, className = "", icon = null }: any) => (
  <div className="space-y-1">
    <p className="text-xs font-medium  uppercase tracking-tight flex items-center gap-1">
      {icon} {label}
    </p>
    <p className={` font-medium ${className}`}>{value || "—"}</p>
  </div>
);

export default EmployerProfilePage;

// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import EditEmployerForm from "./EditEmployerForm";
// import DeleteEmployerForm from "./DeleteEmployerForm";

// const page = async () => {
//   const session = await verifySession();

//   const user = await prisma.user.findUnique({
//     where: { id: session?.userId },
//     select: {
//       id: true,
//       username: true,
//       email: true,
//       role: true,
//       verified: true,
//       lastSignin: true,
//       employerProfile: true,
//     },
//   });
//   // console.log(user, "user ", session, "session");

//   // // 1. Get the date value directly (it will be a Date object or null)
//   // const dateOfBirthPrisma = data?.employerProfiles?.dateOfBirth;

//   // // 2. Conditionally process the date only if it exists
//   // const dateOnly = dateOfBirthPrisma
//   //   ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
//   //   : ""; // If null, set it to an empty string

//   return (
//     <div className=" ">
//       <p>{user?.username}</p>
//       <p>{user?.email}</p>
//       <p>{user?.role}</p>
//       <p>{user?.verified}</p>

//       <EditEmployerForm />
//       {user?.employerProfile?.id && (
//         <div className="flex flex-col border p-2 m-1 text-sky-400">
//           <div className="flex justify-between">
//             <h1 className="text-3xl p-2 m-1 uppercase">Profile Data</h1>
//             <DeleteEmployerForm profile_id={user?.employerProfile?.id} />
//           </div>
//           <div>
//             <p>{user?.employerProfile?.id} employerProfile</p>
//             <p>{user?.employerProfile?.userId} userId</p>
//             <p>{user?.employerProfile?.companyName}</p>
//             <p>{user?.employerProfile?.companyEmail}</p>
//             <p>{user?.employerProfile?.companyDescription}</p>
//             <p>{user?.employerProfile?.industry}</p>
//             <p>{user?.employerProfile?.phone}</p>

//             {/* <p>{dateOnly}</p> */}
//             <p>{user?.employerProfile?.country}</p>
//             <p>{user?.employerProfile?.address}</p>
//             <p>{user?.employerProfile?.state}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default page;
