import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
interface RecallPeriodSelectorProps {
  register: UseFormRegister<FormValues>;
}
export default function RecallPeriodSelector({
  register,
}: RecallPeriodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <h2 className="text-2xl">Recall Period</h2>
     <div className="flex">
        <select id="recall" {...register("recallPeriod")} className="rounded-lg h-8 self-center">
          {Array.from(Array(39).keys()).map((key) => (
            <option key={key} value={+key }>
              {+key}
            </option>
          ))}
        </select>
          <label htmlFor="recall" className="self-center">Week/s</label>
     </div>
     
    </div>
  );
}
