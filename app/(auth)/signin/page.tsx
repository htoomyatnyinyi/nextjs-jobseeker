import React from "react";
import SignInForm from "./form";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <SignInForm />
      <Link href="/reset-password"> Reset Password</Link>
      <Link href="/verify-email"> Re-send Email varification</Link>
    </div>
  );
};

export default page;
