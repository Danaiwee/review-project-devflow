"use client";

import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";

interface SaveQuestionProps {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ hasSaved: boolean }>>;
  userId: string | null | undefined;
}

const SaveQuestion = ({ questionId, hasSavedQuestionPromise, userId }: SaveQuestionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { data } = use(hasSavedQuestionPromise);
  const { hasSaved } = data || {};

  const handleSaveQuestion = async () => {
    if (isLoading) return;
    if (!userId) {
      toast("You need to be logged in to save a question");
      return;
    }

    setIsLoading(true);
    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });
      if (!success) throw new Error(error?.message || "An error occurred");

      const message = data?.saved ? "saved" : "unsaved";

      toast(`Question ${message} successfully`, {
        description: "You can see your save question in collection page"
      });
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "Cannot save the question"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="Save question icon"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSaveQuestion}
    />
  );
};

export default SaveQuestion;
