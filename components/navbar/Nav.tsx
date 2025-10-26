"use server";

import Link from "next/link";
import Links from "./Links";
import MobileNav from "./MobileNav";
import { verifySession } from "@/lib/session";

const Nav = async () => {
  const session = await verifySession();
  // console.log(session, "check session");

  // Map any roles that child components don't expect (e.g. "ADMIN") to undefined
  // and keep allowed roles as-is with a narrow type.
  const safeRole: "USER" | "EMPLOYER" | null | undefined =
    session?.role === "ADMIN"
      ? undefined
      : (session?.role as "USER" | "EMPLOYER" | null | undefined);

  return (
    <div>
      <div className="py-2 p-2 m-1 backdrop-blur-3xl shadow-xl ">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="p-2 m-1 ">
            <h1>jobDiary Inc</h1>
          </Link>
          <div className="hidden xl:flex xl:items-center">
            <Links role={safeRole} userId={session?.userId} />
          </div>
          <div className="xl:hidden">
            <MobileNav role={safeRole} userId={session?.userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
