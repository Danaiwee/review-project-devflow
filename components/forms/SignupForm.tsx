"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { ROUTES } from "@/constants/routes";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { SignUpSchema } from "@/lib/validations";

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

interface SignUpFormProps {
  defaultValues: Record<string, string>;
}

const SignUpForm = ({ defaultValues }: SignUpFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: defaultValues,
  });

  const handleFormSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    try {
      const result = await signUpWithCredentials(data);
      if (result.success) {
        toast("Success", {
          description: "Sign up successfully",
        });

        router.push(ROUTES.HOME);
      }
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "An error occurred during sign up",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<z.infer<typeof SignUpSchema>>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700 capitalize">
                  {field.name === "email" ? "Email Address" : field.name}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900 cursor-pointer"
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>

        <p>
          Already have an account?{" "}
          <Link
            href={ROUTES.SIGN_IN}
            className="paragraph-semibold primary-text-gradient"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
