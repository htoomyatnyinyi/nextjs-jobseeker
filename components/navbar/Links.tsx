"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../theme/ModeToggle";

const Links = () => {
  const pathname = usePathname();
  // console.log("Current Pathname:", pathname);

  const links = [
    {
      name: "home",
      path: "/",
    },
    {
      name: "signin",
      path: "/signin",
    },
    {
      name: "signup",
      path: "/signup",
    },
    {
      name: "admin",
      path: "/admin",
    },
    {
      name: "dashboad",
      path: "/dashboard",
    },
    {
      name: "profile",
      path: "/profile",
    },
    {
      name: "jobs",
      path: "/jobs",
    },
  ];

  return (
    <div className="flex  items-center gap-8  ">
      {links.map((link, index) => (
        <div key={index}>
          <Link
            href={link.path}
            className={`${
              pathname === link.path &&
              "border-b-2 hover:text-green-500 font-medium border-green-500 capitalize"
            }`}
          >
            {link.name}
          </Link>
        </div>
      ))}
      <ModeToggle />
    </div>
  );
};

export default Links;
