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
    <div className="flex flex-wrap flex-col sm:flex-row content-between justify-between gap-4 ">
      <h2 className="text-2xl">Quantity</h2>
     <div className="flex w-9">
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setValue("quantity", Math.max(quantity - 1, 1))}
        >
          -
        </button>
        <input
          type="number"
          inputMode="numeric"
          id="quantity"
          {...register("quantity",{valueAsNumber:true})}
          value={+quantity}
          className="text-center self-center w-12 h-8"
        />
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setValue("quantity", +quantity + 1)}
        >
          +
        </button>
     </div>
    </div>
  );
};
export default QuantitySelector;
