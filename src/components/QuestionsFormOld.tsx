import { useEffect, useState } from "react";
import DifficultySelectors, { Difficulties } from "./DifficultySelectors";
import TagsSearch from "./TagsSearch";
import ClassSelector from "./ClassSelector";

export interface Class {
  id: number;
  class_name: string;
  sow_id: number;
}

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
  const [classes, setClasses] = useState<Class[] | []>([]);
  const [selectedClasses, setSelectedClasses] = useState<
    Record<string, boolean>
  >({});
  useEffect(() => {
    console.log("useEffect checker");
    populateClasses();
  }, []);

  const populateClasses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/classes`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const classes = await response.json();
      setClasses(classes);
      setSelectedClasses(
        // eslint-disable-next-line no-prototype-builtins
        Object.fromEntries(classes.map((classItem:Class)=>{if(classItem.hasOwnProperty('class_name')){return[classItem,true]}}))
        // classes.reduce(
        //   (acc: Class[], key: string) => ({ ...acc, [key]: true }),
        //   {}
          //this is ALMOST correct, but we're getting an empty object: true at the start of the object / Map
          //happens for both implementations

        )
      ;
    } catch (error) {
      console.error((error as Error).message);
    }
  };

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
      className="flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <section id="controls" className="flex justify-evenly gap-4">
        <div className="flex flex-col justify-evenly">
          <ClassSelector
            classes={classes}
            selectedClasses={selectedClasses}
            setSelectedClasses={setSelectedClasses}
          />
          <div>Content Type</div>
          <div>Quantity</div>
        </div>
        <div className="flex flex-col self-end">
          <TagsSearch tags={tags} setTags={setTags} />
          <DifficultySelectors
            difficulties={difficulties}
            setDifficulties={setDifficulties}
          />
          <div className="self-center text-2xl btn" onClick={handleSubmit}>
            Generate
          </div>
        </div>
      </section>
    </form>
  );
}
