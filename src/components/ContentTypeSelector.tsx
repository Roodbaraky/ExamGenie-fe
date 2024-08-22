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
  <>
    <h2 className="text-2xl">Content Type</h2>
    <div className="grid grid-cols-2 grid-rows-2 place-items-center gap-1">
      {Object.entries(contentTypes).map(([code, name]) => (
        <div className="w-full" key={code}>
          <input
            className="hidden peer"
            required
            type="radio"
            id={code}
            value={code}
            {...register("contentType")}
          />
          <label
            htmlFor={code}
            className=" w-full btn btn-outline peer-checked:btn-active peer-checked:text-white"
          >
            {name}
          </label>
        </div>
      ))}
    </div>
  </>
);
