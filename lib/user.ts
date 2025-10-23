import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { taintUniqueValue } from "next/dist/server/app-render/rsc/taint";
import { cache } from "react";

export const getUser = cache(async () => {
  // 1. Verify user's session
  const session = await verifySession();
  console.log(session, "check session verify");
  //   2. Fetch user data
  const data = await prisma.user.findMany();

  //   3. Filter user data
  const filteredUser = userDTO(data);
  return filteredUser;
});

const userDTO = (user: any) => {
  taintUniqueValue(
    "Do not pass a user session token to the client.",
    user,
    user.session.token
  );

  return {
    name: user.name,
    email: user.email,
    session: user.session,
    auditTrail: canViewAudit(user.auditTrail, user.role),
  };
};

const canViewAudit = (auditTrail: any, role: any) => {
  return role === "admin" ? auditTrail : null;
};
