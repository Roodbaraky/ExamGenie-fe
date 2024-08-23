import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
interface RecallPeriodSelectorProps {
  register: UseFormRegister<FormValues>;
}
export default function RecallPeriodSelector({
  register,
}: RecallPeriodSelectorProps) {
  return (
    <div className="flex flex-col gap-4 bg-base-100 rounded-md p-2">
      <h2 className="text-2xl">Recall Period</h2>
     <div className="flex justify-center">
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
