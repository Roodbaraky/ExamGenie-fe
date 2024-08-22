export interface Week {
  week_number: number;
  tags: string[];
}

interface SchemeOfWorkProps {
  weeks: Week[];
}
export default function SchemeOfWork({ weeks }: SchemeOfWorkProps) {
  weeks.sort((a, b) => a.week_number - b.week_number);
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl">Scheme of Work</h2>

      <div className="overflow-scroll max-h-96 p-4">
        {weeks.map((week: Week) => (
          <div key={week.week_number} className="flex gap-4 p-1">
            <div>Week {week.week_number}:</div>
            {[week.tags.map((tag) => (
                <a key={tag} className="btn">
                  {tag.replace("-", ": ")}
                  {/* do something better here ^ */}
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
