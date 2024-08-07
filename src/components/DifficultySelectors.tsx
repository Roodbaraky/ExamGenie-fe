import { ChangeEvent } from "react";
export type Difficulties = {
  foundation?: boolean;
  crossover?: boolean;
  higher?: boolean;
  extended?: boolean;
};
type DifficultySelectorsProps = {
  difficulties: Difficulties;
  setDifficulties: (difficulties: Difficulties) => void;
};

export default function DifficultySelectors({
  difficulties,
  setDifficulties,
}: DifficultySelectorsProps) {
  const handleDifficultyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDifficulties({
      ...difficulties,
      [name]: checked,
    });
  };
  return (
    <div className="flex flex-col px-4">
      <h3 className=" text-xl self-center">Difficulty</h3>
      <div className="flex gap-3 p-2">
        <label>
          Foundation
          <input
            type="checkbox"
            name="foundation"
            checked={difficulties.foundation}
            onChange={handleDifficultyChange}
          />
        </label>
        <label>
          Crossover
          <input
            type="checkbox"
            name="crossover"
            checked={difficulties.crossover}
            onChange={handleDifficultyChange}
          />
        </label>
        <label>
          Higher
          <input
            type="checkbox"
            name="higher"
            checked={difficulties.higher}
            onChange={handleDifficultyChange}
          />
        </label>
        <label>
          Extended
          <input
            type="checkbox"
            name="extended"
            checked={difficulties.extended}
            onChange={handleDifficultyChange}
          />
        </label>
      </div>
    </div>
  );
}
