import { UseFormWatch } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import { useEffect } from "react";

export interface Week {
  week_number: number;
  tags: string[];
}

interface SchemeOfWorkProps {
  weeks: Week[];
  watch: UseFormWatch<FormValues>;
}
export default function SchemeOfWork({ weeks, watch }: SchemeOfWorkProps) {
  weeks.sort((a, b) => a.week_number - b.week_number);
  const currentWeek = watch("currentWeek");
  const recallPeriod = watch("recallPeriod");

  useEffect(() => {
    document
      .getElementById(`${currentWeek}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
  }, [currentWeek]);
  return (
    <div className="flex flex-col h-full max-h-full w-full ">
      <h2 className="text-2xl">Scheme of Work</h2>
      <div className=" overflow-scroll min-w-full h-full max-h-full p-4 rounded-xl">
        {weeks.map((week: Week) => (
          <div key={week.week_number} className="flex flex-nowrap gap-4 p-1">
            <div
              id={`${week.week_number}`}
            >
             <p className={`p-1 ${
                week.week_number === +currentWeek
                  ? "badge-success rounded-full"
                  : week.week_number >= currentWeek - recallPeriod &&
                    week.week_number < currentWeek
                  ? "backdrop-brightness-90 rounded-full"
                  : ""
              } w-fit text-nowrap`}> Week {week.week_number}:</p>
            </div>
            {[
              week.tags.map((tag) => (
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
      </div>
    </div>
  );
}
