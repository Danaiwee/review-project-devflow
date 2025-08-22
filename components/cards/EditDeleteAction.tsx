"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ROUTES } from "@/constants/routes";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface EditDeleteActionProps {
  type: "Question" | "Answer";
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: EditDeleteActionProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleEdit = () => {
    router.push(ROUTES.QUESTION_EDIT(itemId));
  };

  const handleDelete = async () => {
    setIsPending(true);

    if (type === "Question") {
      try {
        const result = await deleteQuestion({ questionId: itemId });

        if (result.success) {
          toast("Success", { description: "Deleted question successcully" });
          return;
        }

        toast("Error", {
          description: "Something went wrong, please try again later",
        });
      } catch (error) {
        console.log(error);
        toast("Error", {
          description: "Something went wrong, please try again later",
        });
      } finally {
        setIsPending(false);
      }
    }

    if (type === "Answer") {
      try {
        const result = await deleteAnswer({ answerId: itemId });

        if (result.success) {
          toast("Success", { description: "Deleted answer successcully" });
          return;
        }

        toast("Error", {
          description: "Something went wrong, please try again later",
        });
      } catch (error) {
        console.log(error);
        toast("Error", {
          description: "Something went wrong, please try again later",
        });
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "Answer" && "gap-0 justify-center"}`}
    >
      {type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image
            src="/icons/trash.svg"
            alt="trah icon"
            width={14}
            height={14}
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "Question" ? "question" : "answer"} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="border-primary-100 bg-red-500 text-light-800"
              onClick={handleDelete}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
