import { useEffect } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import SchemeOfWorkSkeleton from "./SchemeOfWorkSkeleton";

export interface Week {
  week_number: number;
  tags: string[];
}

interface SchemeOfWorkProps {
  weeks: Week[];
  watch: UseFormWatch<FormValues>;
  isSuccess:boolean;
  isLoading:boolean
}
export default function SchemeOfWork({
  weeks,
  watch,
  isSuccess,
  isLoading,
}: SchemeOfWorkProps) {
  weeks?.sort((a, b) => a.week_number - b.week_number);
  const currentWeek = watch("currentWeek");
  const recallPeriod = watch("recallPeriod");

  useEffect(() => {
    document.getElementById(`${currentWeek}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [currentWeek]);
  return (
    <div className="flex h-full max-h-full w-full flex-col">
      <h2 className="text-2xl">Scheme of Work</h2>
      <div className="h-full max-h-full min-w-full overflow-scroll rounded-xl p-4">
        {isSuccess &&
          weeks?.map((week: Week) => (
            <div key={week.week_number} className="flex flex-nowrap gap-4 p-1">
              <div id={`${week.week_number}`}>
                <p
                  className={`p-1 ${
                    week.week_number === +currentWeek
                      ? "badge-success rounded-full"
                      : week.week_number >= currentWeek - recallPeriod &&
                          week.week_number < currentWeek
                        ? "rounded-full backdrop-brightness-90"
                        : ""
                  } w-fit text-nowrap`}
                >
                  {" "}
                  Week {week.week_number}:
                </p>
              </div>
              {[
                week?.tags?.map((tag) => (
                  <a key={tag} className="btn">
                    {tag.replace(/-/g, " ")}
                  </a>
                )),
                <a key={"plus-btn"} className="btn btn-outline">
                  +
                </a>,
              ]}
            </div>
          ))}
        {isLoading && <SchemeOfWorkSkeleton />}
      </div>
    </div>
  );
}
