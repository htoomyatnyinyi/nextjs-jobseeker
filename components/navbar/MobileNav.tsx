"use client";

import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../theme/ModeToggle";

const MobileNav = () => {
  const pathname = usePathname();
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
      name: "dashboard",
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
    <div className="flex justify-center items-center gap-8">
      <Sheet>
        <SheetTrigger>
          <Menu className="text-4xl " />
        </SheetTrigger>
        <SheetContent className="flex felx-col text-center">
          <SheetTitle>B</SheetTitle>
          <SheetDescription>C</SheetDescription>
          <div className="mt-8 ">
            <h1 className="text-4xl">jobDiary</h1>
          </div>
          <div className="mb-40 pb-10 mt-40 text-2xl flex flex-col gap-8 justify-center">
            {links.map((link, index) => (
              <div
                key={index}
                className={`${
                  pathname === link.path && "border-b-2 border-green-500 "
                }`}
              >
                <Link href={link.path}>{link.name}</Link>
              </div>
            ))}
          </div>
          {/* <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader> */}
        </SheetContent>
      </Sheet>

      <ModeToggle />
    </div>
  );
};

export default MobileNav;
