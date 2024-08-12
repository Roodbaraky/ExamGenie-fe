import { ChangeEvent, useEffect } from "react";
import { Class } from "./QuestionsFormOld";

interface ClassSelectorProps {
  classes: Class[];
  selectedClasses: Record<string, boolean>;
  setSelectedClasses: (selectedClasses: Record<string, boolean>) => void;
}
export default function ClassSelector({
  classes,
  selectedClasses,
  setSelectedClasses,
}: ClassSelectorProps) {
  const handleSelectedClassesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSelectedClasses({
      ...selectedClasses,
      [name]: checked,
    });
  };

  useEffect(() => {
    console.log(selectedClasses);
  
  }, [selectedClasses]);

  return (
    <div>
      Classes
      <div className="flex gap-1">
        {classes.map((classItem) => (
          <label key={classItem.id}>
            {classItem?.class_name}
            <input
              type="checkbox"
              name={classItem?.class_name}
              checked={selectedClasses?.class_name}
              onChange={handleSelectedClassesChange}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
