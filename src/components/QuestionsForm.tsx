import { RestartAlt } from "@mui/icons-material";
import { pdf } from "@react-pdf/renderer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { dateFormatter } from "../utils/dateFormatter";
import ClassSelector from "./ClassSelector";
import { ContentTypeSelector } from "./ContentTypeSelector";
import CurrentWeek from "./CurrentWeek";
import { DifficultySelector } from "./DifficultySelectors";
import { Error as ErrorComponent } from "./Error";
import PDFFile from "./PDFFile";
import QuantitySelector from "./QuantitySelector";
import RecallPeriodSelector from "./RecallPeriodSelector";
import SchemeOfWork from "./SchemeOfWork";
const API_URL = import.meta.env.VITE_API_URL;

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
  const {
    mutate,
    isIdle,
    isPending: isDataLoading,
    isSuccess: isDataSuccess,
    data: returnedData,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: async (data: FormValues) => {
      let apiURL = `${API_URL}/questions`;
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
        throw Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  });
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
    questionURLs: Question[],
  ) => {
    const blob = await pdf(
      <PDFFile format={format} questionURLs={questionURLs} />,
    ).toBlob();
    saveAs(blob, `${className} ${format} ${dateFormatter()}`);
  };

  const onSubmit = async (data: FormValues) => {
    mutate(data);
  };

  const className = watch("className");
  const query = useQuery({
    queryKey: [className],
    queryFn: () =>
      fetch(`${API_URL}/weeks?className=${className}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!className,
  });

  const isSubmitDisabled =
    !isValid || query?.data?.length === 0 || isSubmitting;

  const { isLoading, isSuccess } = query;

  return (
    <>
      <form
        id="form"
        className="relative grid max-h-screen grid-cols-[6fr_5fr] grid-rows-[8fr_2fr] gap-4 bg-base-300 p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section
          id="controls"
          className="col-span-1 col-start-1 flex h-full max-h-[590px] flex-col gap-4 rounded-xl bg-base-200 p-4"
        >
          <ClassSelector register={register} />
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
          className="max-w-40vw col-span-1 col-start-2 flex h-[590px] flex-shrink rounded-xl bg-base-200 p-4"
        >
          <SchemeOfWork
            weeks={query?.data}
            watch={watch}
            isLoading={isLoading}
            isSuccess={isSuccess}
            refetch={query?.refetch}
          />
        </section>
        {(!isDataSuccess || isIdle) && (
          <button
            disabled={isSubmitDisabled}
            className="btn btn-primary btn-lg col-span-2 mx-auto my-auto w-[60%] max-w-64 rounded-lg px-4 py-2 text-3xl"
          >
            {!isDataLoading ? (
              <span>Generate</span>
            ) : (
              <span className="loading loading-spinner"></span>
            )}
          </button>
        )}
        {isDataSuccess && (
          <div className="col-span-2 col-start-1 mx-auto flex items-center gap-4 self-center">
            <a id="q-download" className="btn btn-lg" onClick={handleDownload}>
              Download Questions
            </a>
            <a id="a-download" className="btn btn-lg" onClick={handleDownload}>
              Download Answers
            </a>
            <a
              className="btn btn-outline btn-lg"
              onClick={() => {
                form.reset();
                reset();
              }}
            >
              Reset <RestartAlt />
            </a>
            <a
              className="btn btn-outline btn-lg"
              onClick={handleSubmit((d) => {
                onSubmit(d);
              })}
            >
              Generate More
            </a>
          </div>
        )}
        {isError && <ErrorComponent message={error.message} />}
      </form>
    </>
  );
}
