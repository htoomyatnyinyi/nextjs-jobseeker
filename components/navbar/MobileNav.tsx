"use client";

import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"; // Removed SheetDescription as it wasn't being used effectively
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../theme/ModeToggle";
import SignOutForm from "@/app/(auth)/signout/form";

// --- Link Definitions (Copied from the previous fix for consistency) ---
const COMMON_LINKS = [
  { name: "home", path: "/" },
  { name: "signin", path: "/signin" },
  { name: "signup", path: "/signup" },
];

const USER_LINKS = [
  { name: "User Profile", path: "/user/profile" },
  { name: "User Dashboard", path: "/user/dashboard" },
  { name: "User Resume", path: "/user/resume" },
  { name: "jobs", path: "/jobs" },
];

const EMPLOYER_LINKS = [
  { name: "Employer Profile", path: "/employer/profile" },
  { name: "Employer Jobs", path: "/employer/jobs" },
  { name: "Employer Dashboard", path: "/employer/dashboard" },
  { name: "jobs", path: "/jobs" },
];
// ------------------------------------------------------------------------

// Added the 'role' prop
const MobileNav = ({
  role,
  userId,
}: {
  role?: "USER" | "EMPLOYER" | null;
  userId: string | undefined;
}) => {
  const pathname = usePathname();

  // 1. Determine the set of links based on the role
  const roleSpecificLinks =
    role === "USER" ? USER_LINKS : role === "EMPLOYER" ? EMPLOYER_LINKS : [];

  // 2. Filter COMMON_LINKS based on whether a role is present
  const filteredCommonLinks = COMMON_LINKS.filter((link) => {
    // If a role is present, hide signin and signup links
    if (role && (link.path === "/signin" || link.path === "/signup")) {
      return false;
    }
    return true;
  });

  // 3. Combine the two sets of links
  const linksToShow = [...filteredCommonLinks, ...roleSpecificLinks];

  return (
    <div className="flex justify-center items-center gap-4">
      {" "}
      {/* Reduced gap for mobile */}
      <ModeToggle />{" "}
      {/* Moved ModeToggle outside the Sheet for direct access */}
      <Sheet>
        <SheetTrigger asChild>
          {/* Using asChild to make the Menu icon the direct trigger */}
          <button aria-label="Open menu">
            <Menu className="h-6 w-6" /> {/* Standardized size */}
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col pt-12">
          <SheetHeader className="pb-8">
            <SheetTitle className="text-3xl font-bold text-center">
              jobDiary
            </SheetTitle>
          </SheetHeader>

          {/* Navigation Links Section */}
          <nav className="flex flex-col gap-6 text-xl items-start">
            {linksToShow.map((link, index) => (
              <div key={index} className="w-full">
                {/* Wrap Link with a function to close the sheet after clicking */}
                <Link
                  href={link.path}
                  // Styling the active link
                  className={`
                    block py-2 w-full text-left capitalize transition-colors
                    ${
                      pathname === link.path
                        ? "text-green-500 font-semibold border-b-2 border-green-500"
                        : "hover:text-green-500"
                    }
                  `}
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </nav>
          <SignOutForm userId={userId} />

          {/* Optional: You can place the ModeToggle here if you prefer it inside the menu */}
          {/* <div className="mt-auto pt-4 border-t">
              <ModeToggle />
          </div> */}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;

// "use client";

// import { usePathname } from "next/navigation";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "../ui/sheet";
// import { Menu } from "lucide-react";
// import Link from "next/link";
// import { ModeToggle } from "../theme/ModeToggle";

// const MobileNav = () => {
//   const pathname = usePathname();
//   const links = [
//     {
//       name: "home",
//       path: "/",
//     },
//     {
//       name: "signin",
//       path: "/signin",
//     },
//     {
//       name: "signup",
//       path: "/signup",
//     },
//     {
//       name: "User Profile",
//       path: "/user/profile",
//     },
//     {
//       name: "User Dashboard",
//       path: "/user/dashboard",
//     },
//     {
//       name: "Employer Profile",
//       path: "/employer/profile",
//     },
//     {
//       name: "Employer Dashboard",
//       path: "/employer/dashboard",
//     },
//     {
//       name: "jobs",
//       path: "/jobs",
//     },
//   ];

//   return (
//     <div className="flex justify-center items-center gap-8">
//       <Sheet>
//         <SheetTrigger>
//           <Menu className="text-4xl " />
//         </SheetTrigger>
//         <SheetContent className="flex felx-col text-center">
//           <SheetTitle>B</SheetTitle>
//           <SheetDescription>C</SheetDescription>
//           <div className="mt-8 ">
//             <h1 className="text-4xl">jobDiary</h1>
//           </div>
//           <div className="mb-40 pb-10 mt-40 text-2xl flex flex-col gap-8 justify-center">
//             {links.map((link, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   pathname === link.path && "border-b-2 border-green-500 "
//                 }`}
//               >
//                 <Link href={link.path}>{link.name}</Link>
//               </div>
//             ))}
//           </div>
//           {/* <SheetHeader>
//             <SheetTitle>Are you absolutely sure?</SheetTitle>
//             <SheetDescription>
//               This action cannot be undone. This will permanently delete your
//               account and remove your data from our servers.
//             </SheetDescription>
//           </SheetHeader> */}
//         </SheetContent>
//       </Sheet>

//       <ModeToggle />
//     </div>
//   );
// };

// export default MobileNav;
