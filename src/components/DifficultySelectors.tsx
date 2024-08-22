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
    <div className="flex flex-wrap gap-3 p-2">
      {difficulties.map((difficulty: string) => (
        <div key={difficulty}>
          <input
          className="hidden peer"
            type="checkbox"
            id={difficulty}
            {...register(`difficulties.${difficulty}`)}
          />
          <label htmlFor={difficulty} className="btn btn-outline peer-checked:btn-active peer-checked:text-white">{difficulty}</label>
        </div>
      ))}
    </div>
  </div>
);
