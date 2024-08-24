import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { FormValues } from "./QuestionsForm";

interface QuantitySelectorProps {
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
}

const QuantitySelector = ({
  register,
  setValue,
  watch,
}: QuantitySelectorProps) => {
  const quantity = watch("quantity");
  return (
    <div className="flex min-w-fit flex-col content-between justify-center gap-4 rounded-lg p-2 outline outline-1">
      <h2 className="text-center text-2xl">Quantity</h2>
      <div className="flex w-14 min-w-28 justify-center">
        <button
          type="button"
          className="btn btn-outline btn-sm size-8"
          onClick={() => setValue("quantity", Math.max(quantity - 1, 1))}
        >
          -
        </button>
        <input
          type="number"
          inputMode="numeric"
          id="quantity"
          {...register("quantity", { valueAsNumber: true })}
          value={+quantity}
          className="h-full w-12 self-center rounded text-center"
        />
        <button
          type="button"
          className="btn btn-outline btn-sm size-8"
          onClick={() => setValue("quantity", +quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};
export default QuantitySelector;
