import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ClassSelector from "./ClassSelector";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { DifficultySelector } from "./DifficultySelectors";
import PDFFile from "./PDFFile";
import QuantitySelector from "./QuantitySelector";
import RecallPeriodSelector from "./RecallPeriodSelector";
import SchemeOfWork, { Week } from "./SchemeOfWork";
import { TagsSearch } from "./TagsSearch";
import { dateFormatter } from "../utils/dateFormatter";

export interface FormValues {
  className: string;
  difficulties: Record<string, boolean>;
  search: "";
  tags: string[];
  contentType: string;
  quantity: number;
  recallPeriod: number;
  currentWeek: number;
}


export interface Question {
  URL?: string
  id: number
  difficulty: string
  tags: string[]
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
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");

  const form = useForm<FormValues>({
    defaultValues: {
      className: "",
      difficulties: {},
      tags: [],
      contentType: "",
      quantity: 1,
      recallPeriod: 1,
      currentWeek: 5,
    },
  });

  const { register, handleSubmit, setValue } = form;

  const postFilters = async (data: FormValues) => {
    try {
      let apiURl = `http://127.0.0.1:3001/questions`;

      if (+data.quantity >= 1) apiURl += `?limit=${data.quantity}`;

      const response = await fetch(apiURl, {
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
      return returnedData;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const generatePDF = async (
    format: string,
    className: string,
    questionURLs: Question[]
  ) => {
    const blob = await pdf(
      <PDFFile format={format} questionURLs={questionURLs} />
    ).toBlob();
    saveAs(blob, `${className} ${format} ${dateFormatter()}`);
  };

  const onSubmit = async (data: FormValues) => {
    console.log("Submitted Data:", data);
    try {
      const format = form.getValues("contentType");
      const className = form.getValues("className");
      const questionURLs = (await postFilters(data))
      await generatePDF(format, className, questionURLs);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      populateWeeks(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  const populateWeeks = async (className: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/weeks?className=${className}`
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const weeks = await response.json();
      setWeeks(weeks);
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
            <ClassSelector
              register={register}
              setSelectedClass={setSelectedClass}
            />
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
            <label htmlFor="currentWeek">Current Week</label>
            <input type="number" {...register("currentWeek")} />
            <button className="self-center text-2xl btn">Generate</button>
          </div>
        </section>
        <SchemeOfWork
          weeks={weeks}
          // register={register}
        />
      </form>
    </>
  );
}
