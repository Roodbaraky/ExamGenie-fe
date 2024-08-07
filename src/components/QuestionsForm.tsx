import { useState } from "react";
import TagsSearch from "./TagsSearch";
import DifficultySelectors, { Difficulties } from "./DifficultySelectors";

export default function QuestionsForm() {
  const initialTags: string[] = [];
  const initialDifficulties: Difficulties = {
    foundation: false,
    crossover: false,
    higher: false,
    extended: false,
  };

  const [tags, setTags] = useState(initialTags);
  const [difficulties, setDifficulties] = useState(initialDifficulties);

  return (
    <form
      action=""
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="flex self-end">
        <TagsSearch tags={tags} setTags={setTags} />
        <DifficultySelectors
          difficulties={difficulties}
          setDifficulties={setDifficulties}
        />
      </div>
      <div
        className="self-center text-2xl btn"
        onClick={(e) => {
          e.preventDefault();
          //Generate PDF of questions which match filters
        }}
      >
        Generate
      </div>
    </form>
  );
}
