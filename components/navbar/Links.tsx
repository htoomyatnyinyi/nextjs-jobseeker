"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../theme/ModeToggle";
import SignOutForm from "@/app/(auth)/signout/form";

const COMMON_LINKS = [
  { name: "home", path: "/" },
  { name: "signin", path: "/signin" },
  { name: "signup", path: "/signup" },
];

const USER_LINKS = [
  { name: "jobs", path: "/jobs" },
  { name: "User Profile", path: "/user/profile" },
  { name: "User Dashboard", path: "/user/dashboard" },
];

const EMPLOYER_LINKS = [
  { name: "Employer Profile", path: "/employer/profile" },
  { name: "Employer Jobs", path: "/employer/jobs" },
  { name: "Employer Dashboard", path: "/employer/dashboard" },
  { name: "jobs", path: "/jobs" },
];

// Define the component with a clear type for the role prop
const Links = ({
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

  // 2. Filter COMMON_LINKS based on whether a role is present (i.e., USER is logged in)
  const filteredCommonLinks = COMMON_LINKS.filter((link) => {
    // If a role is present, hide signin and signup links
    if (role && (link.path === "/signin" || link.path === "/signup")) {
      return false;
    }
    return true;
  });

  // 3. Combine the two sets of links
  const linksToShow = [...filteredCommonLinks, ...roleSpecificLinks];

  const LinkItem = ({ link }: { link: { name: string; path: string } }) => (
    <Link
      href={link.path}
      className={`${
        pathname === link.path
          ? "border-b-2 font-medium border-green-500 capitalize text-green-500"
          : "hover:text-green-500 capitalize"
      }`}
    >
      {link.name}
    </Link>
  );

  return (
    <div className="flex items-center gap-8">
      {/* 4. Map over the final, combined array */}
      {linksToShow.map((link, index) => (
        <div key={index}>
          <LinkItem link={link} />
        </div>
      ))}
      <ModeToggle />
      <SignOutForm userId={userId} />
    </div>
  );
};

export default Links;

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ModeToggle } from "../theme/ModeToggle";

// const Links = async ({ role }: any) => {
//   const pathname = usePathname();
//   // console.log(role, "role");

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

//   const linksForUser = [
//     {
//       name: "User Profile",
//       path: "/user/profile",
//     },
//     {
//       name: "User Dashboard",
//       path: "/user/dashboard",
//     },
//   ];

//   const linksForEmployer = [
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
//     <div className="flex  items-center gap-8  ">
//       {links.map((link, index) => (
//         <div key={index}>
//           {/* <Link
//             href={link.path}
//             className={`${
//               pathname === link.path &&
//               "border-b-2 hover:text-green-500 font-medium border-green-500 capitalize"
//             }`}
//           >
//             {link.name}
//           </Link> */}
//           <div>
//             {role === "user" &&
//               linksForUser.map((link, index) => (
//                 <div key={index}>
//                   <Link
//                     href={link.path}
//                     className={`${
//                       pathname === link.path &&
//                       "border-b-2 hover:text-green-500 font-medium border-green-500 capitalize"
//                     }`}
//                   >
//                     {link.name}
//                   </Link>
//                 </div>
//               ))}
//             {role === "employer" &&
//               linksForEmployer.map((link, index) => (
//                 <div key={index}>
//                   <Link
//                     href={link.path}
//                     className={`${
//                       pathname === link.path &&
//                       "border-b-2 hover:text-green-500 font-medium border-green-500 capitalize"
//                     }`}
//                   >
//                     {link.name}
//                   </Link>
//                 </div>
//               ))}
//           </div>
//         </div>
//       ))}
//       <ModeToggle />
//     </div>
//   );
// };

// export default Links;
