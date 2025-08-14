import { Metadata } from "next";
import React from "react";

import SignUpForm from "@/components/forms/SignupForm";

export const metadata: Metadata = {
  title: "DevFlow | Sign up",
  description:
    "Join DevFlow today to start asking questions, sharing your expertise, and collaborating with a vibrant developer community.",
};

const SignUpPage = () => {
  return (
    <SignUpForm
      defaultValues={{
        username: "",
        name: "",
        email: "",
        password: "",
      }}
    />
  );
};

export default SignUpPage;
