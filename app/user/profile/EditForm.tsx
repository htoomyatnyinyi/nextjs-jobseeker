"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useActionState } from "react";
import { editProfile } from "./actions";
import {
  Edit3,
  Loader2,
  Save,
  User,
  MapPin,
  BookOpen,
  Smartphone,
} from "lucide-react";

const EditForm = ({ data }: any) => {
  const [state, action, pending] = useActionState(editProfile, {
    success: false,
    message: "",
  });

  const dateOnly = data?.jobSeekerProfile?.dateOfBirth
    ? new Date(data.jobSeekerProfile.dateOfBirth).toISOString().split("T")[0]
    : "";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all flex items-center gap-2">
          <Edit3 size={16} /> Edit Profile
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-bold">Edit Profile</SheetTitle>
          <SheetDescription>
            Update your personal information to help recruiters find you.
          </SheetDescription>
        </SheetHeader>

        <form action={action} className="space-y-6 pb-10">
          <input type="text" hidden name="id" defaultValue={data?.id} />

          {/* Group 1: Names */}
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              name="fullName"
              defaultValue={data?.jobSeekerProfile?.fullName}
              icon={<User size={14} />}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                name="firstName"
                defaultValue={data?.jobSeekerProfile?.firstName}
              />
              <FormInput
                label="Last Name"
                name="lastName"
                defaultValue={data?.jobSeekerProfile?.lastName}
              />
            </div>
          </div>

          {/* Group 2: Contact & Personal */}
          <div className="space-y-4 pt-4 border-t">
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              defaultValue={data?.jobSeekerProfile?.phone}
              icon={<Smartphone size={14} />}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Gender
              </label>
              <select
                name="gender"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                defaultValue={data?.jobSeekerProfile?.gender}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>

            <FormInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              defaultValue={dateOnly}
            />
          </div>

          {/* Group 3: Location & Bio */}
          <div className="space-y-4 pt-4 border-t">
            <FormInput
              label="Address"
              name="address"
              defaultValue={data?.jobSeekerProfile?.address}
              icon={<MapPin size={14} />}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Education
              </label>
              <textarea
                name="education"
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                defaultValue={data?.jobSeekerProfile?.education}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                Professional Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                defaultValue={data?.jobSeekerProfile?.bio}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {pending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Save Changes
          </button>

          {state?.message && (
            <p
              className={`text-center text-sm font-medium ${
                state.success ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {state.message}
            </p>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
};

const FormInput = ({ label, icon, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase ml-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all ${
          icon ? "pl-10" : "pl-3"
        }`}
      />
    </div>
  </div>
);

export default EditForm;
// "use client";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetDescription, // Optional, but good for context
//   SheetTrigger,
// } from "@/components/ui/sheet";

// import { useActionState } from "react";
// import { editProfile } from "./actions";

// const EditForm = ({ data }: any) => {
//   const [state, action, pending] = useActionState(editProfile, {
//     success: false,
//     message: "",
//   });

//   // 1. Get the date value directly (it will be a Date object or null)
//   const dateOfBirthPrisma = data?.jobSeekerProfile?.dateOfBirth;

//   // 2. Conditionally process the date only if it exists
//   const dateOnly = dateOfBirthPrisma
//     ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
//     : ""; // If null, set it to an empty string

//   return (
//     <div className="border p-2 m-1">
//       <Sheet>
//         <SheetTrigger>Touch Me Edit Form</SheetTrigger>
//         <SheetContent>
//           <SheetHeader>
//             <SheetTitle>Edit your profile</SheetTitle>
//             <SheetDescription>
//               Make changes to your profile here. Click save when you're done.
//             </SheetDescription>
//           </SheetHeader>
//           <div className="flex flex-col">
//             <p>{data?.jobSeekerProfile?.id} jobSeekerProfile</p>
//             <p>{data?.id} userId</p>
//             <p>{data?.jobSeekerProfile?.fullName}</p>
//             <p>{data?.jobSeekerProfile?.firstName}</p>
//             <p>{data?.jobSeekerProfile?.lastName}</p>
//             <p>{data?.jobSeekerProfile?.phone}</p>
//             {/* <p>{data?.jobSeekerProfile?.dateOfBirth}</p> */}
//             <p>{dateOnly}</p>
//             <p>{data?.jobSeekerProfile?.gender}</p>
//             <p>{data?.jobSeekerProfile?.address}</p>
//             <p>{data?.jobSeekerProfile?.bio}</p>
//             <p>{data?.jobSeekerProfile?.education}</p>
//           </div>
//           {/* Your form and other content go here */}
//           <form className="mt-4 space-y-4" action={action}>
//             {/* userId */}
//             <input
//               type="text"
//               hidden
//               name="id"
//               defaultValue={data?.id}
//               // defaultValue={data?.jobSeekerProfile?.id}
//             />
//             <input
//               type="text"
//               name="fullName"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               // placeholder={data?.jobSeekerProfile?.fullName || "fullName"}
//               placeholder="fullName"
//               defaultValue={data?.jobSeekerProfile?.fullName}
//             />
//             <input
//               type="text"
//               name="firstName"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="firstName"
//               defaultValue={data?.jobSeekerProfile?.firstName}
//             />
//             <input
//               type="text"
//               name="lastName"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="lastName"
//               defaultValue={data?.jobSeekerProfile?.lastName}
//             />
//             <input
//               type="tel"
//               name="phone"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="phone"
//               defaultValue={data?.jobSeekerProfile?.phone}
//             />
//             <select
//               name="gender"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               defaultValue={data?.jobSeekerProfile?.gender}
//             >
//               <option
//                 value="MALE"
//                 className="p-2 m-1 text-sky-400 border-sky-500 border"
//               >
//                 Male
//               </option>
//               <option
//                 value="FEMALE"
//                 className="p-2 m-1 text-sky-400 border-sky-500 border"
//               >
//                 Female
//               </option>
//               <option
//                 value="OTHER"
//                 className="p-2 m-1 text-sky-400 border-sky-500 border"
//               >
//                 Other
//               </option>
//               <option
//                 value="PREFER_NOT_TO_SAY"
//                 className="p-2 m-1 text-sky-400 border-sky-500 border"
//               >
//                 Prefer not to say
//               </option>
//             </select>
//             <input
//               type="date"
//               name="dateOfBirth"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="date of birth"
//               defaultValue={dateOnly}
//               // defaultValue={data?.jobSeekerProfile?.dateOfBirth}
//             />
//             <input
//               type="text"
//               name="address"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="address"
//               defaultValue={data?.jobSeekerProfile?.address}
//             />
//             <input
//               type="text"
//               name="bio"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="bio"
//               defaultValue={data?.jobSeekerProfile?.bio}
//             />
//             <input
//               type="text"
//               name="education"
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//               placeholder="education"
//               defaultValue={data?.jobSeekerProfile?.education}
//             />
//             <button
//               type="submit"
//               disabled={pending}
//               className="p-2 m-1 text-sky-400 border-sky-500 border"
//             >
//               Save
//             </button>
//           </form>{" "}
//         </SheetContent>
//       </Sheet>
//       {/* This form seems to be outside the sheet, I'm leaving it as is. */}
//       <form className="mt-4 space-y-4" action={action}>
//         {/* userId */}
//         <input
//           type="text"
//           hidden
//           name="id"
//           defaultValue={data?.id}
//           // defaultValue={data?.jobSeekerProfile?.id}
//         />
//         <input
//           type="text"
//           name="fullName"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           // placeholder={data?.jobSeekerProfile?.fullName || "fullName"}
//           placeholder="fullName"
//           defaultValue={data?.jobSeekerProfile?.fullName}
//         />
//         <input
//           type="text"
//           name="firstName"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="firstName"
//           defaultValue={data?.jobSeekerProfile?.firstName}
//         />
//         <input
//           type="text"
//           name="lastName"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="lastName"
//           defaultValue={data?.jobSeekerProfile?.lastName}
//         />
//         <input
//           type="tel"
//           name="phone"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="phone"
//           defaultValue={data?.jobSeekerProfile?.phone}
//         />
//         <select
//           name="gender"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           defaultValue={data?.jobSeekerProfile?.gender}
//         >
//           <option
//             value="MALE"
//             className="p-2 m-1 text-sky-400 border-sky-500 border"
//           >
//             Male
//           </option>
//           <option
//             value="FEMALE"
//             className="p-2 m-1 text-sky-400 border-sky-500 border"
//           >
//             Female
//           </option>
//           <option
//             value="OTHER"
//             className="p-2 m-1 text-sky-400 border-sky-500 border"
//           >
//             Other
//           </option>
//           <option
//             value="PREFER_NOT_TO_SAY"
//             className="p-2 m-1 text-sky-400 border-sky-500 border"
//           >
//             Prefer not to say
//           </option>
//         </select>
//         <input
//           type="date"
//           name="dateOfBirth"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="date of birth"
//           defaultValue={dateOnly}
//           // defaultValue={data?.jobSeekerProfile?.dateOfBirth}
//         />
//         <input
//           type="text"
//           name="address"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="address"
//           defaultValue={data?.jobSeekerProfile?.address}
//         />
//         <input
//           type="text"
//           name="bio"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="bio"
//           defaultValue={data?.jobSeekerProfile?.bio}
//         />
//         <input
//           type="text"
//           name="education"
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//           placeholder="education"
//           defaultValue={data?.jobSeekerProfile?.education}
//         />
//         <button
//           type="submit"
//           disabled={pending}
//           className="p-2 m-1 text-sky-400 border-sky-500 border"
//         >
//           Save
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditForm;
