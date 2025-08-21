import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import { getUser } from "@/lib/actions/user.action";

export const metadata: Metadata = {
  title: "DevFlow | Edit Profile",
  description:
    "Update and customize your developer profile, including your name, username, location, portfolio, and bio details.",
};

const EditProfilePage = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (session?.user?.id !== id) return notFound();

  const { data } = await getUser({ userId: id });
  const { user } = data!;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <ProfileForm
        user={user}
        defaultValues={{
          name: "",
          username: "",
          portfolio: "",
          location: "",
          bio: "",
        }}
      />
    </>
  );
};

export default EditProfilePage;
