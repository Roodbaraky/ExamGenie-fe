import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ClassSelector from "./ClassSelector";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { DifficultySelector } from "./DifficultySelectors";
import QuantitySelector from "./QuantitySelector";
import RecallPeriodSelector from "./RecallPeriodSelector";
import { TagsSearch } from "./TagsSearch";
import SchemeOfWork, { Week } from "./SchemeOfWork";
// import { BLANK_PDF, type Template } from "@pdfme/common";
// import { generate } from "@pdfme/generator";

// const template: Template = {
//   basePdf: BLANK_PDF,
//   schemas: [
//     {
//       a: {
//         type: "text",
//         position: { x: 0, y: 0 },
//         width: 10,
//         height: 10,
//       },
//       b: {
//         type: "text",
//         position: { x: 10, y: 10 },
//         width: 10,
//         height: 10,
//       },
//       c: {
//         type: "text",
//         position: { x: 20, y: 20 },
//         width: 10,
//         height: 10,
//       },
//     },
//   ],
// };

export interface Class {
  id: number;
  class_name: string;
  sow_id: number;
}

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
interface ImageURLObject {
  status: string;
  value: string;
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
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<ImageURLObject[]>([]);

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
  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
    const postFilters = async () => {
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
        setImageURLs(returnedData[1]);
        // const inputs = returnedData[1];

        // generate({ template, inputs }).then((pdf) => {
        //   console.log(pdf);

        //   const blob = new Blob([pdf.buffer], { type: "application/pdf" });
        //   window.open(URL.createObjectURL(blob));

        //   // Node.js
        //   // fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
        // });
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
    console.log("Class changed", selectedClass);
    if (selectedClass) {
      populateWeeks(selectedClass);
    }
  }, [selectedClass]);
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

  const populateWeeks = async (className: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/weeks?className=${className}`
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const weeks = await response.json();
      console.log(weeks);
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
              classes={classes}
              register={register}
              setSelectedClass={setSelectedClass}
              // onChange={() => {
              //   populateWeeks();
              // }}
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
      <div
        id="images"
        className="outline outline-1 outline-red-500 flex flex-col gap-2 items-center
      "
      >
        <h2 className="text-2xl">Testing Only:</h2>
        {imageURLs.map((imageURLObject: ImageURLObject, index) => (
          <img
            key={imageURLObject.value ?? imageURLObject.status + index}
            src={
              imageURLObject.value ??
              `https://1080motion.com/wp-content/uploads/2018/06/NoImageFound.jpg.png`
            }
            width={500}
            height={300}
          ></img>
        ))}
      </div>
    </>
  );
}
