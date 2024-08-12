import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import { Class } from "./QuestionsForm";

interface ClassSelectorProps {
  classes: Class[];
  register: UseFormRegister<FormValues>;
}
export default function ClassSelector({
  classes,
  register,
}: ClassSelectorProps) {
  return (
    <div className="flex flex-col justify-evenly">
      <h2 className="text-2xl">Classes</h2>
      <div className="flex gap-1">
        {classes.map((classItem) => (
          <div key={classItem.id}>
            <label htmlFor={classItem.class_name}>{classItem.class_name}</label>
            <input
              type="radio"
              id={classItem.class_name}
              value={classItem.class_name}
              {...register(`class`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
