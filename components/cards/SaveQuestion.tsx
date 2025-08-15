"use client";

import Image from "next/image";

interface SaveQuestionProps {
  questionId: string;
  hasSavedQuestionPromise: string;
}

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: SaveQuestionProps) => {
  const hasSaved = true;
  const isLoading = false;

  const handleSaveQuestion = () => {};
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
