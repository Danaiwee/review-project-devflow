import { Metadata } from "next";
import React from "react";

import AuthForm from "@/components/forms/SignInForm";

export const metadata: Metadata = {
  title: "DevFlow | Sign in",
  description:
    "Sign in to your DevFlow account to ask questions, share answers, and connect with developers around the world.",
};

const SignInPage = () => {
  return <AuthForm defaultValues={{ email: "", password: "" }} />;
};

export default SignInPage;
