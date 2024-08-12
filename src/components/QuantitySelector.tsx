import { UseFormRegister } from "react-hook-form";
import { FormValues } from "./QuestionsForm";

interface QuantitySelectorProps {
  register: UseFormRegister<FormValues>;
}

const QuantitySelector = ({ register }: QuantitySelectorProps) => (
  <div>
    <h2 className="text-2xl">Quantity</h2>
    <label htmlFor="quantity"></label>
    <input type="number" id="quantity" {...register("quantity")} />
  </div>
);

export default QuantitySelector;
