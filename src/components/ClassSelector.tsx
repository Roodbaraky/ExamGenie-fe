import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import { Class } from "./QuestionsForm";
import { Dispatch, SetStateAction } from "react";

interface ClassSelectorProps {
  classes: Class[];
  register: UseFormRegister<FormValues>;
  setSelectedClass: Dispatch<SetStateAction<string>>;
}
export default function ClassSelector({
  classes,
  register,
  setSelectedClass,
}: ClassSelectorProps) {
  return (
    <div className="flex flex-col justify-evenly">
      <h2 className="text-2xl">Classes</h2>
      <div className="flex gap-1">
        {classes.map((classItem) => (
          <div key={classItem.id}>
            <label htmlFor={classItem.class_name}>{classItem.class_name}</label>
            <input
              required
              type="radio"
              id={classItem.class_name}
              value={classItem.class_name}
              {...register(`className`, {
                onChange: (e) => {
                  setSelectedClass(e.target.value);
                },
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
