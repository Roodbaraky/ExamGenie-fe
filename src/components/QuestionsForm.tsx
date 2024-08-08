import { useState } from "react";
import DifficultySelectors, { Difficulties } from "./DifficultySelectors";
import TagsSearch from "./TagsSearch";

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
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags, difficulties }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <form
      action=""
      id="form"
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
      <div className="self-center text-2xl btn" onClick={handleSubmit}>
        Generate
      </div>
    </form>
  );
}
