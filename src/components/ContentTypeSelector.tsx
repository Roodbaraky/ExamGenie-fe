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
  <div className="flex flex-col justify-center rounded-md ">
    <h2 className="text-2xl">Content Type</h2>
    <div className="grid grid-cols-2 grid-rows-2 items-center content-center place-items-center gap-2">
      {Object.entries(contentTypes).map(([code, name]) => (
        <div className="w-full flex flex-grow" key={code}>
          <input
            className="opacity-0 absolute peer"
            required
            type="radio"
            id={code}
            value={code}
            {...register("contentType", {required:true})}
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
  </div>
);
