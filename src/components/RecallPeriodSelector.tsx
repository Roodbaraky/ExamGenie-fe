import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
interface RecallPeriodSelectorProps {
  register: UseFormRegister<FormValues>;
}
export default function RecallPeriodSelector({
  register,
}: RecallPeriodSelectorProps) {
  return (
    <div className="flex gap-4">
      <h2 className="text-2xl">Recall Period</h2>
      <select id="recall" {...register("recallPeriod")} className="rounded-lg">
        {Array.from(Array(39).keys()).map((key) => (
          <option key={key} value={+key + 1}>
            {+key + 1}
          </option>
        ))}
      </select>
        <label htmlFor="recall" className="self-center">Week/s</label>
     
    </div>
  );
}
