import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface Class {
  id: number;
  class_name: string;
  sow_id: number;
}

interface ClassSelectorProps {
  register: UseFormRegister<FormValues>;
  setSelectedClass: Dispatch<SetStateAction<string>>;
}
export default function ClassSelector({
  register,
  setSelectedClass,
}: ClassSelectorProps) {

  const [classes, setClasses] = useState<Class[] | []>([]);

  const populateClasses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/classes`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const classes = await response.json();
      setClasses(classes);
    } catch (error) {
      console.error((error as Error).message);
    }
  };


  useEffect(() => {
    populateClasses();
  }, []);

  


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
