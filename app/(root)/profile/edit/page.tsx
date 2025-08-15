import React from "react";

import ProfileForm from "@/components/forms/ProfileForm";
import { USERS } from "@/constants";

const EditProfilePage = () => {
  const user = USERS[3];

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
