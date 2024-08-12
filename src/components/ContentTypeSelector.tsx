import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";

interface ContentTypeSelectorProps {
  contentTypes: Record<string, string>;
  register: UseFormRegister<FormValues>;
}

export const ContentTypeSelector = ({
  contentTypes,
  register,
}: ContentTypeSelectorProps) => (
  <div>
    <h2 className="text-2xl">Content Type</h2>
    {Object.entries(contentTypes).map(([code, name]) => (
      <div key={code}>
        <label htmlFor={code}>{name}</label>
        <input
          required
          type="radio"
          id={code}
          value={code}
          {...register("contentType")}
        />
      </div>
    ))}
  </div>
);
