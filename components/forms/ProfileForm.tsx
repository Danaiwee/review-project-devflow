"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Path, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ROUTES } from "@/constants/routes";
import { editUserProfile } from "@/lib/actions/user.action";
import { ProfileSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface ProfileFormProps {
  user: User;
  defaultValues: Record<string, string>;
}

const ProfileForm = ({ user, defaultValues }: ProfileFormProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
  });

  const handleUpdateProfile = async (data: z.infer<typeof ProfileSchema>) => {
    setIsPending(true);
    try {
      const result = await editUserProfile({
        userId: user._id,
        ...data,
      });

      if (result.success) {
        toast("Success", { description: "Updated profile successfully" });

        router.push(ROUTES.PROFILE(user._id));
        return;
      }

      return;
    } catch (error) {
      console.log(error);
      toast("Error", { description: "Error in updating profile" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateProfile)}
        className="mt-9 flex w-full flex-col gap-9"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<z.infer<typeof ProfileSchema>>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700 capitalize">
                  {field.name}
                  <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  {field.name === "bio" ? (
                    <Textarea
                      className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[150px] border"
                      {...field}
                    />
                  ) : (
                    <Input
                      type="text"
                      {...field}
                      className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="mt-7 flex justify-end">
          <Button
            className="primary-gradient w-fit text-primary-100"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
