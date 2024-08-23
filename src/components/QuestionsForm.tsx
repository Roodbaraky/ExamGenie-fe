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
import CurrentWeek from "./CurrentWeek";

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
      contentType: undefined,
      quantity: 1,
      recallPeriod: 5,
      currentWeek: 0,
      includeAnswers: false,
    },
    mode: "onChange",
    criteriaMode: "all",
  });

  const { register, handleSubmit, setValue, watch, formState } = form;
  const { isValid, isSubmitting } = formState;
  const isSubmitDisabled = !isValid || weeks.length === 0 || isSubmitting;
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
      form.reset();

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
      const response = await postFilters(data);
      const questionURLs = response[0];
      const answerURLs = response[1];
      await generatePDF(format, className, questionURLs);
      await generatePDF(format, "answers " + className, answerURLs);
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
        className="grid grid-cols-[6fr_5fr] grid-rows-[8fr_2fr]  gap-4 relative h-full p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section
          id="controls"
          className="p-4 col-start-1 col-span-1 flex flex-col gap-4 h-full max-h-[550px] bg-base-200 rounded-xl"
        >
          <ClassSelector
            register={register}
            setSelectedClass={setSelectedClass}
          />
          <ContentTypeSelector
            register={register}
            contentTypes={contentTypes}
          />
          <DifficultySelector difficulties={difficulties} register={register} />
          <div className="flex justify-evenly">
            <QuantitySelector
              register={register}
              setValue={setValue}
              watch={watch}
            />
            <RecallPeriodSelector register={register} />
          </div>

          <CurrentWeek register={register} />
        </section>

        <section
          id="sow"
          className="bg-base-200  p-4 col-start-2 col-span-1 h-[550px] flex flex-shrink rounded-xl"
        >
          <SchemeOfWork weeks={weeks} watch={watch} />
        </section>
        {submissionState.notStarted ? (
          <button
            disabled={isSubmitDisabled}
            className="text-xl btn btn-primary py-2 px-4 rounded-lg  col-span-2 my-auto mx-auto w-[60%] max-w-64"
          >
            Generate
          </button>
        ) : (
          <Loader
            width={75}
            height={75}
            className="my-auto mx-auto text-center place-content-center"
          />
        )}
      </form>
    </>
  );
}
