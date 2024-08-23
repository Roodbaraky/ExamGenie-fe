import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import {
  MouseEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import { RestartAlt } from "@mui/icons-material";

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
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [returnedData, setReturnedData] = useState();

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
      // form.reset();
      setIsDownloadReady(true);

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
  const handleDownload = async (e: MouseEvent) => {
    const format = form.getValues("contentType");
    const className = form.getValues("className");
    if ((e.target as HTMLElement).id === "q-download" && returnedData) {
      await generatePDF(format, className, returnedData[0]);
    } else if ((e.target as HTMLElement).id === "a-download" && returnedData) {
      await generatePDF(format, "answers " + className, returnedData[1]);
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
      const response = await postFilters(data);
      setReturnedData(response);
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
          className="p-4 col-start-1 col-span-1 flex flex-col gap-4 h-full max-h-[590px] bg-base-200 rounded-xl"
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
          className="bg-base-200  p-4 col-start-2 col-span-1 h-[590px] flex flex-shrink rounded-xl"
        >
          <SchemeOfWork weeks={weeks} watch={watch} />
        </section>
        {submissionState.notStarted && !isDownloadReady ? (
          <button
            disabled={isSubmitDisabled}
            className="text-3xl btn btn-primary btn-lg py-2 px-4 rounded-lg  col-span-2 my-auto mx-auto w-[60%] max-w-64"
          >
            Generate
          </button>
        ) : isDownloadReady ? (
          <div className="flex gap-4 self-center mx-auto col-start-1 col-span-2">
            <a id="q-download" className="btn btn-lg" onClick={handleDownload}>
              Download Questions
            </a>
            <a id="a-download" className="btn btn-lg" onClick={handleDownload}>
              Download Answers
            </a>
            <a
              className="btn btn-lg btn-outline"
              onClick={() => {
                setIsDownloadReady(false);
                form.reset();
              }}
            >
              <RestartAlt />
            </a>
          </div>
        ) : (
          <Loader
            width={75}
            height={75}
            className="my-auto mx-auto text-center place-content-center col-span-2 col-start-1 self-center"
          />
        )}
      </form>
    </>
  );
}
