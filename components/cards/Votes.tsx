"use client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";

interface VotesProps {
  upvotes: number;
  downvotes: number;
  targetId: string;
  targetType: "question" | "answer";
  hasUpvoted?: boolean;
  hasDownvoted?: boolean;
  userId: string | null;
}

const Votes = ({ upvotes, downvotes, hasUpvoted, hasDownvoted, targetId, targetType, userId }: VotesProps) => {
  const [isDownvoting, setIsDownvoting] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      toast("You need to be logged in to vote a question");
      return;
    }
    if (voteType === "upvote") {
      setIsUpvoting(true);
    } else {
      setIsDownvoting(true);
    }
    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType
      });

      if (result.success) {
        const successMessage =
          voteType === "upvote"
            ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
            : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

        toast("Success", {
          description: `${successMessage}`
        });
        return;
      }
      return;
    } catch (error) {
      console.log(error);
      toast("Error", { description: `Failed to ${voteType} ${targetType}` });
    } finally {
      setIsUpvoting(false);
      setIsDownvoting(false);
    }
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isUpvoting && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(upvotes)}</p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isDownvoting && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">{formatNumber(downvotes)}</p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
