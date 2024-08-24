import { useQuery } from "@tanstack/react-query";
import { UseFormRegister } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import ClassesSkeleton from "./ClassesSkeleton";
import { FormValues } from "./QuestionsForm";

export interface Class {
  id: number;
  class_name: string;
  sow_id: number;
}

interface ClassSelectorProps {
  register: UseFormRegister<FormValues>;
}
export default function ClassSelector({ register }: ClassSelectorProps) {
  const { token } = useAuth();

  const query = useQuery({
    queryKey: ["classes"],
    queryFn: () =>
      fetch(`http://127.0.0.1:3001/classes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  const { isLoading } = query;

  return (
    <div className="flex flex-col justify-evenly">
      <h2 className="text-2xl">Classes</h2>
      <div className="flex flex-wrap justify-evenly gap-2">
        {!isLoading ? (
          query?.data.map((classItem: Class) => (
            <div key={classItem.id} className="flex flex-grow">
              <input
                required
                type="radio"
                id={classItem.class_name}
                value={classItem.class_name}
                className="peer absolute opacity-0"
                {...register(`className`)}
              />
              <label
                htmlFor={classItem.class_name}
                className="btn btn-outline flex-grow peer-checked:btn-active peer-checked:text-white"
              >
                {classItem.class_name}
              </label>
            </div>
          ))
        ) : (
          <ClassesSkeleton />
        )}
      </div>
    </div>
  );
}
