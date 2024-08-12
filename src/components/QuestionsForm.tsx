import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TagsSearch } from "./TagsSearch";
import { DifficultySelector } from "./DifficultySelectors";
import QuantitySelector from "./QuantitySelector";
import RecallPeriodSelector from "./RecallPeriodSelector";
import { ContentTypeSelector } from "./ContentTypeSelector";
import ClassSelector from "./ClassSelector";

export interface Class {
  id: number;
  class_name: string;
  sow_id: number;
}
export interface FormValues {
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
      class: "",
      difficulties: {},
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
    console.log("useEffect checker");
    setValue("tags", tags);
  }, [tags, setValue]);

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
        id="form"
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section id="controls" className="flex justify-evenly gap-4">
          <div className="flex flex-col justify-evenly">
            <ClassSelector classes={classes} register={register} />
            <ContentTypeSelector
              register={register}
              contentTypes={contentTypes}
            />
            <QuantitySelector register={register} />
            <RecallPeriodSelector register={register} />
          </div>
          <div className="flex flex-col self-end">
            <TagsSearch
              tags={tags}
              setTags={setTags}
              register={register}
              setValue={setValue}
            />
            <DifficultySelector
              difficulties={difficulties}
              register={register}
            />
            <button className="self-center text-2xl btn">Generate</button>
          </div>
        </section>
      </form>
    </>
  );
}
