import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
interface RecallPeriodSelectorProps {
  register: UseFormRegister<FormValues>;
}
export default function RecallPeriodSelector({
  register,
}: RecallPeriodSelectorProps) {
  return (
    <div>
      <h2 className="text-2xl">Recall Period</h2>
      <label htmlFor="recall"></label>
      <select id="recall" {...register("recallPeriod")}>
        {Array.from(Array(39).keys()).map((key) => (
          <option key={key} value={+key + 1}>
            {+key + 1}
          </option>
        ))}
      </select>
      Week/s
    </div>
  );
}
