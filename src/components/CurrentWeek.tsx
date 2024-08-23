import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";

interface CurrentWeekProps {
  register: UseFormRegister<FormValues>;
}
export default function CurrentWeek({ register }: CurrentWeekProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor="currentWeek" className="text-xl font-medium">
        Current Week (Demo purposes only):
      </label>
      <input
        required
        type="number"
        {...register("currentWeek", { min: 1, max: 39 })}
        className="border rounded-md w-64 self-center"
      />
    </div>
  );
}
