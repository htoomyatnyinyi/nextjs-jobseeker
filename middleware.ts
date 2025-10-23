import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/session";

// Define protected routes for each role
const protectedRoutes = {
  jobSeeker: [
    "/jobseeker",
    "/jobseeker/dashboard",
    "/jobseeker/profile",
    "/jobseeker/resumes",
    "/jobseeker/applications",
    "/jobseeker/saved-jobs",
  ],
  employer: [
    "/employer",
    "/employer/dashboard",
    "/employer/job-posts",
    "/employer/profile",
  ],
  admin: [
    "/admin",
    "/admin/users",
    "/admin/job-posts",
    "/admin/employer-profiles",
  ],
};

// Combine all protected routes for quick lookup
const allProtectedRoutes = [
  ...protectedRoutes.jobSeeker,
  ...protectedRoutes.employer,
  ...protectedRoutes.admin,
];

export const middleware = async (req: NextRequest) => {
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = allProtectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  // Skip middleware for public routes (e.g., /signin, /api, static assets)
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for valid session
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  let session = null;

  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (error) {
      console.error("Failed to decrypt session:", error);
    }
  }

  // Redirect unauthenticated users to sign-in
  if (!session?.userId || !session?.role) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  const { role } = session;

  // Define allowed routes based on role
  let allowedRoutes: string[] = [];
  if (role === "USER") {
    allowedRoutes = protectedRoutes.jobSeeker;
  } else if (role === "EMPLOYER") {
    allowedRoutes = protectedRoutes.employer;
  } else if (role === "ADMIN") {
    allowedRoutes = allProtectedRoutes; // Admins can access all routes
  } else {
    // Invalid role
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // Check if the current path is allowed for the user's role
  const isAllowed = allowedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (!isAllowed) {
    // Redirect to an unauthorized page or the user's dashboard
    return NextResponse.redirect(
      new URL(
        role === "USER"
          ? "/jobseeker/dashboard"
          : role === "EMPLOYER"
          ? "/employer/dashboard"
          : "/signin",
        req.nextUrl
      )
    );
  }

  // Allow the request to proceed
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|signin|signup).*)"],
};
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { decrypt } from "./lib/session";

// const middleware = async (req: NextRequest) => {
//   // 1. Check if route is protected
//   const protectedRoutes = ["/dashboard"];
//   const currentPath = req.nextUrl.pathname;
//   const isProtectedRoute = protectedRoutes.includes(currentPath);

//   if (isProtectedRoute) {
//     // 2. Check for valid session
//     const cookieStore = await cookies();
//     const cookie = cookieStore.get("session")?.value;
//     console.log(cookie, " middleware");

//     let session = null;
//     if (cookie) {
//       session = await decrypt(cookie);
//     }
//     // 3. Redirect unauthed users
//     if (!session?.userId) {
//       return NextResponse.redirect(new URL("/signin", req.nextUrl));
//     }
//   }

//   // 4. Render route
//   return NextResponse.next();
// };

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image).*)"],
// };

// export default middleware;
