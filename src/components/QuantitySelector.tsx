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
    <div className="flex  flex-col  min-w-fit content-between justify-center  gap-4 bg-base-100 p-1 rounded-md">
      <h2 className="text-2xl text-center">Quantity</h2>
     <div className="flex w-14 min-w-28 justify-center">
        <button
          type="button"
          className="btn btn-sm btn-primary"
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
          className="btn btn-sm btn-primary"
          onClick={() => setValue("quantity", +quantity + 1)}
        >
          +
        </button>
     </div>
    </div>
  );
};
export default QuantitySelector;
