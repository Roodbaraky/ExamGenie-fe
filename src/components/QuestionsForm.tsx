import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { dateFormatter } from "../utils/dateFormatter";
import ClassSelector from "./ClassSelector";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { DifficultySelector } from "./DifficultySelectors";
import PDFFile from "./PDFFile";
import QuantitySelector from "./QuantitySelector";
import RecallPeriodSelector from "./RecallPeriodSelector";
import SchemeOfWork, { Week } from "./SchemeOfWork";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

export interface FormValues {
  className: string;
  difficulties: Record<string, boolean>;
  search: "";
  tags: string[];
  contentType: string;
  quantity: number;
  recallPeriod: number;
  currentWeek: number;
  includeAnswers: boolean;
}

export interface Question {
  URL?: string;
  id: number;
  difficulty: string;
  tags: string[];
}

export default function QuestionsForm() {
  const difficulties = ["foundation", "crossover", "higher", "extended"];
  const contentTypes = {
    "1QSTR": "One Question Starter Slides",
    "4QSTR": "Four Question Starter Slides",
    FPA: "Full Page Assessment",
    HPA: "Half Page Assessment",
  };

  const { token } = useAuth();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [submissionState, setSubmissionState] = useState({
    notStarted: true,
    isPending: false,
    isComplete: false,
  });

  const form = useForm<FormValues>({
    defaultValues: {
      className: "",
      difficulties: {},
      tags: [],
      contentType: "",
      quantity: 1,
      recallPeriod: 5,
      currentWeek: 25,
      includeAnswers: false,
    },
  });

  const { register, handleSubmit, setValue, watch } = form;
  const postFilters = async (data: FormValues) => {
    if (!token) {
      console.error("No token found");
      return;
    }
    setSubmissionState({
      ...submissionState,
      notStarted: false,
      isPending: true,
    });
    try {
      let apiURL = `http://127.0.0.1:3001/questions`;

      if (+data.quantity >= 1) apiURL += `?limit=${data.quantity}`;

      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const returnedData = await response.json();

      console.log("returnedData: ", returnedData);
      setSubmissionState({
        ...submissionState,
        isPending: false,
        isComplete: true,
      });
      form.reset()

      return returnedData;
    } catch (error) {
      console.error("Error posting filters:", error);
      setSubmissionState({
        ...submissionState,
        notStarted: true,
        isPending: false,
        isComplete: false,
      });

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
    // console.log("Token:", token);

    try {
      // Pop up to ask if you want answers too
      // --> setValue answers to true, so backend knows to fetch answers images from bucket too
      const format = form.getValues("contentType");
      const className = form.getValues("className");
      const questionURLs = await postFilters(data);
      await generatePDF(format, className, questionURLs);
    } catch (error) {
      console.error("Error during form submission:", (error as Error).message);
    }
  };

  const populateWeeks = useCallback(
    async (className: string) => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:3001/weeks?className=${className}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const weeks = await response.json();
        setWeeks(weeks);
      } catch (error) {
        console.error("Error fetching weeks:", (error as Error).message);
      }
    },
    [token]
  );

  useEffect(() => {
    if (selectedClass) {
      populateWeeks(selectedClass);
    }
  }, [populateWeeks, selectedClass]);

  return (
    <>
      <form
        id="form"
        className="grid grid-cols-3 gap-4 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section id="controls" className="col-span-3 grid grid-cols-2 gap-4">
          <div className="grid grid-cols-1 gap-4">
            <ClassSelector
              register={register}
              setSelectedClass={setSelectedClass}
            />
            <ContentTypeSelector
              register={register}
              contentTypes={contentTypes}
            />
            <div className="flex justify-between">
              <QuantitySelector
                register={register}
                setValue={setValue}
                watch={watch}
              />
              <RecallPeriodSelector register={register} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <DifficultySelector
              difficulties={difficulties}
              register={register}
            />
            <div className="flex flex-col">
              <label htmlFor="currentWeek" className="text-xl font-medium">
                Current Week (Dev purposes only):
              </label>
              <input
                required
                type="number"
                {...register("currentWeek")}
                className="border rounded-md w-64 self-center"
              />
            </div>
            {submissionState.notStarted?<button className="text-xl btn bg-blue-500 text-white py-2 px-4 rounded-lg self-center">
              Generate
            </button>:<Loader width={75} height={75}/>}
            </div>
        </section>
        <div className="flex flex-col items-center justify-center"></div>
        <section id="sow" className="col-span-3">
          <SchemeOfWork weeks={weeks} watch={watch} />
        </section>
      </form>
    </>
  );
}
