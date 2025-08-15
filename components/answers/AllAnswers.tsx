import { ANSWER_FILTERS } from "@/constants";
import { EMPTY_ANSWERS } from "@/constants/empty";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../data/DataRenderer";
import CommonFilter from "../search/CommonFilter";

interface AllAnswersProps extends ActionResponse<Answer[]> {
  page: number;
  isNext: boolean;
  totalAnswers: number;
}

const AllAnswers = ({
  page,
  isNext,
  data,
  success,
  error,
  totalAnswers,
}: AllAnswersProps) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>

        <CommonFilter
          filters={ANSWER_FILTERS}
          otherClasses="sm:min-w-32"
          containerClasses="max-xs:w-full"
        />
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={data}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer: Answer) => (
            <AnswerCard key={answer._id} answer={answer} />
          ))
        }
      />
    </div>
  );
};

export default AllAnswers;
