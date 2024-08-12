import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CrossIcon from "./CrossIcon";

export interface Class {
  id: number;
  class_name: string;
  sow_id: number;
}
interface FormValues {
  class: string;
  difficulties: Record<string, boolean>;
  search: "";
  tags: string[];
  contentType: string;
  quantity: number;
  recallPeriod: number;
}

export default function QuestionsForm() {
  const difficulties = ["foundation", "crossover", "higher", "extended"];
  const contentTypes = {
    "1QSTR": "One Question Starter Slides",
    "4QSTR": "Four Question Starter Slides",
    FPA: "Full Page Assessment",
    HPA: "Half Page Assessment",
  };
  const [tags, setTags] = useState<string[]>([]);
  const [classes, setClasses] = useState<Class[] | []>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      classes: {},
      // classes.reduce((acc, classItem) => {
      //   acc[classItem.class_name] = false;
      //   return acc;
      // }, {} as Record<string, boolean>),
      difficulties: {},
      // difficulties.reduce((acc, difficulty) => {
      //   acc[difficulty] = false;
      //   return acc;
      // }, {} as Record<string, boolean>),
      tags: [],
      contentType: "",
      quantity: 1,
      recallPeriod: 1,
    },
  });

  const { register, handleSubmit, setValue } = form;

  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
    const postFilters = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const returnedData = await response.json();
        console.log("returnedData: ", returnedData);
      } catch (error) {
        console.error((error as Error).message);
      }
    };
    postFilters();
  };

  useEffect(() => {
    populateClasses();
  }, []);

  useEffect(() => {
    console.log("useEffect checker 2");
    setValue("tags", tags);
  }, [tags, setValue]);

  function removeTag(tags: string[], tag: string) {
    const index = tags.indexOf(tag);
    if (index === -1) return tags;

    return [...tags.slice(0, index), ...tags.slice(index + 1)];
  }

  const populateClasses = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/classes`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const classes = await response.json();
      setClasses(classes);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <>
      <form
        action=""
        id="form"
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section id="controls" className="flex justify-evenly gap-4">
          <div className="flex flex-col justify-evenly">
            <h2 className="text-2xl">Classes</h2>
            <div className="flex gap-1">
              {classes.map((classItem) => (
                <div key={classItem.id}>
                  <label htmlFor={classItem.class_name}>
                    {classItem.class_name}
                  </label>
                  <input
                    type="radio"
                    id={classItem.class_name}
                    value={classItem.class_name}
                    {...register(`class`)}
                  />
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-2xl">Content Type</h2>
              {Object.entries(contentTypes).map(([code, name]) => (
                <div key={code}>
                  <label htmlFor={code}>{name}</label>
                  <input
                    type="radio"
                    id={code}
                    value={code}
                    {...register("contentType")}
                  />
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-2xl">Quantity</h2>
              <label htmlFor="quantity"></label>
              <input type="number" id="quantity" {...register("quantity")} />
            </div>
            <div>
              <h2 className="text-2xl">Recall Period</h2>
              <label htmlFor="recall"></label>
              <select id="recall" {...register("recallPeriod")}>
                {Array.from(Array(39).keys()).map((key) => (
                  <option key={key} value={+key + 1}>
                    {+key + 1}
                  </option>
                ))}
              </select>
              Week/s
            </div>
          </div>
          <div className="flex flex-col self-end">
            <div className="flex flex-col px-4">
              <h2 className="text-2xl">Tags</h2>
              <div className="flex flex-col gap-3 p-2">
                <label htmlFor="search">Search</label>
                <input
                  type="text"
                  id="search"
                  onKeyDown={(e) => {
                    if (e.currentTarget.id !== "search") {
                      return;
                    }
                    const searchTerm: string = (
                      document.getElementById("search") as HTMLInputElement
                    ).value;
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                    if (
                      searchTerm.length &&
                      e.key === "Enter" &&
                      !tags.includes(searchTerm)
                    ) {
                      setTags([...tags, searchTerm]);
                      e.preventDefault();
                      (
                        document.getElementById("search") as HTMLInputElement
                      ).value = "";
                    }
                  }}
                />
                <div className="flex flex-wrap max-w-56">
                  {tags.map((tag: string) => (
                    <a key={tag} className="badge">
                      <CrossIcon
                        onClick={() => {
                          const newTags = removeTag(tags, tag);
                          setTags(newTags);
                        }}
                      />
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col px-4">
              <h2 className="text-2xl">Difficulty</h2>
              <div className="flex gap-3 p-2">
                {difficulties.map((difficulty: string) => (
                  <div key={difficulty}>
                    <label htmlFor={difficulty}>{difficulty}</label>
                    <input
                      type="checkbox"
                      id={difficulty}
                      {...register(`difficulties.${difficulty}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button className="self-center text-2xl btn">Generate</button>
          </div>
        </section>
      </form>
    </>
  );
}
