import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

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
  const {token} = useAuth();
  const populateClasses = useCallback( async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/classes`, {
        method:'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const classes = await response.json();
      setClasses(classes);
    } catch (error) {
      console.error((error as Error).message);
    }
  },[token])

  useEffect(() => {
    populateClasses();
  }, [populateClasses]);

  return (
    <div className="flex flex-col justify-evenly">
      <h2 className="text-2xl">Classes</h2>
      <div className="flex flex-wrap gap-1">
        {classes.length?classes.map((classItem) => (
          <div key={classItem.id}>
            <input
              required
              type="radio"
              id={classItem.class_name}
              value={classItem.class_name}
              className="hidden peer"
              {...register(`className`, {
                onChange: (e) => {
                  setSelectedClass(e.target.value);
                },
              })}
            />
              <label htmlFor={classItem.class_name} className="btn btn-outline peer-checked:btn-active peer-checked:text-white">{classItem.class_name}</label>
          </div>
        )):<Loader width={75} height={75} className="self-center mx-auto"/>}
      </div>
    </div>
  );
}
