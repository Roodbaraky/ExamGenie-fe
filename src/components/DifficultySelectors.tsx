import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";

interface DifficultySelectorProps {
  difficulties: string[];
  register: UseFormRegister<FormValues>;
}

export const DifficultySelector = ({
  difficulties,
  register,
}: DifficultySelectorProps) => (
  <div className="flex flex-col px-4">
    <h2 className="text-2xl">Difficulty</h2>
    <div className="flex gap-3 p-2">
      {difficulties.map((difficulty: string) => (
        <div key={difficulty}>
          <label htmlFor={difficulty}>{difficulty}</label>
          <input
            type="checkbox"
            id={difficulty}
            {...register(`difficulties.${difficulty}`)}
          />
        </div>
      ))}
    </div>
  </div>
);
