import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./lib/session";

// Define protected routes for each role
const protectedRoutes = {
  user: [
    // "/verifyemail",
    "/user",
    "/user/dashboard",
    "/user/profile",
    "/user/resumes",
    "/user/applications",
    "/user/saved-jobs",
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
  ...protectedRoutes.user,
  ...protectedRoutes.employer,
  ...protectedRoutes.admin,
];

export const proxy = async (req: NextRequest) => {
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
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  const { role } = session;

  // Define allowed routes based on role
  let allowedRoutes: string[] = [];
  if (role === "USER") {
    allowedRoutes = protectedRoutes.user;
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
          ? "/user/dashboard"
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
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico (favicon file)
  //    * - signin (sign-in page)
  //    * - signup (sign-up page)
  //    * - verifyemail (verification page)
  //    * - resend-verification (resend verification page)
  //    */
  //   "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|verifyemail).*)",
  // ],
};

// // import { NextRequest, NextResponse } from "next/server";
// // import { cookies } from "next/headers";
// // import { decrypt } from "./lib/session";

// // const middleware = async (req: NextRequest) => {
// //   // 1. Check if route is protected
// //   const protectedRoutes = ["/dashboard"];
// //   const currentPath = req.nextUrl.pathname;
// //   const isProtectedRoute = protectedRoutes.includes(currentPath);

// //   if (isProtectedRoute) {
// //     // 2. Check for valid session
// //     const cookieStore = await cookies();
// //     const cookie = cookieStore.get("session")?.value;
// //     console.log(cookie, " middleware");

// //     let session = null;
// //     if (cookie) {
// //       session = await decrypt(cookie);
// //     }
// //     // 3. Redirect unauthed users
// //     if (!session?.userId) {
// //       return NextResponse.redirect(new URL("/signin", req.nextUrl));
// //     }
// //   }

// //   // 4. Render route
// //   return NextResponse.next();
// // };

// // export const config = {
// //   matcher: ["/((?!api|_next/static|_next/image).*)"],
// // };

// // export default middleware;

// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { decrypt } from "./lib/session"; // Assuming decrypt returns a session like { userId: string, role: string, emailVerified: boolean }

// // Define protected routes for each role
// const protectedRoutes = {
//   user: [
//     "/user",
//     "/user/dashboard",
//     "/user/profile",
//     "/user/resumes",
//     "/user/applications",
//     "/user/saved-jobs",
//   ],
//   employer: [
//     "/employer",
//     "/employer/dashboard",
//     "/employer/job-posts",
//     "/employer/profile",
//   ],
//   admin: [
//     "/admin",
//     "/admin/users",
//     "/admin/job-posts",
//     "/admin/employer-profiles",
//   ],
// };

// // Combine all protected routes for quick lookup
// const allProtectedRoutes = [
//   ...protectedRoutes.user,
//   ...protectedRoutes.employer,
//   ...protectedRoutes.admin,
// ];

// export const middleware = async (req: NextRequest) => {
//   const currentPath = req.nextUrl.pathname;

//   // 1. Check if the route is one we've defined as protected.
//   // Routes not in this list (like /about, /contact) will be skipped by this check.
//   const isProtectedRoute = allProtectedRoutes.some((route) =>
//     currentPath.startsWith(route)
//   );

//   // Skip middleware logic for routes that are "public" but not in the matcher
//   // (e.g., /about, /pricing, etc.).
//   if (!isProtectedRoute) {
//     return NextResponse.next();
//   }

//   // 2. Check for valid session
//   const cookieStore = await cookies();
//   const cookie = cookieStore.get("session")?.value;
//   let session = null;

//   if (cookie) {
//     try {
//       session = await decrypt(cookie);
//     } catch (error) {
//       console.error("Failed to decrypt session:", error);
//     }
//   }

//   // 3. Redirect unauthenticated users to sign-in
//   if (!session?.userId || !session?.role) {
//     return NextResponse.redirect(new URL("/signin", req.nextUrl));
//   }

//   // 4. ✨ NEW: Add email verification check
//   // This is the logic that starts the redirect to verification.
//   // We check this *after* auth but *before* role checks.
//   // Your session object MUST contain an `emailVerified` boolean for this to work.
//   if (!session.emailVerified) {
//     // If user is not verified, redirect them to the resend page.
//     // The matcher already prevents a loop on /resend-verification and /verifyemail.
//     return NextResponse.redirect(new URL("/signin", req.nextUrl));
//   }

//   // 5. Check role-based access
//   const { role } = session;
//   let allowedRoutes: string[] = [];

//   if (role === "USER") {
//     allowedRoutes = protectedRoutes.user;
//   } else if (role === "EMPLOYER") {
//     allowedRoutes = protectedRoutes.employer;
//   } else if (role === "ADMIN") {
//     // Admins can access all protected routes
//     allowedRoutes = allProtectedRoutes;
//   } else {
//     // Invalid or unknown role
//     return NextResponse.redirect(new URL("/signin", req.nextUrl));
//   }

//   // Check if the current path is allowed for the user's role
//   const isAllowed = allowedRoutes.some((route) =>
//     currentPath.startsWith(route)
//   );

//   if (!isAllowed) {
//     // Redirect to their default dashboard if they try to access a forbidden route
//     return NextResponse.redirect(
//       new URL(
//         role === "USER"
//           ? "/user/dashboard"
//           : role === "EMPLOYER"
//           ? "/employer/dashboard"
//           : "/signin", // Fallback
//         req.nextUrl
//       )
//     );
//   }

//   // 6. Allow the request to proceed
//   return NextResponse.next();
// };

// // This config is CORRECT. It excludes all public/auth routes from the middleware.
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - signin (sign-in page)
//      * - signup (sign-up page)
//      * - verifyemail (verification page, e.g., /verifyemail/token)
//      * - resend-verification (resend verification form page)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|signin|signup|verifyemail).*)",
//   ],
// };
