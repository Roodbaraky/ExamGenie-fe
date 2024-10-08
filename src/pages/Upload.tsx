import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangeEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AutoCompleteSearch from "../components/AutocompleteSearch";
import Loader from "../components/Loader";
import { useAuth } from "../hooks/useAuth";
import { UploadFormValues } from "../types/types";
const API_URL = import.meta.env.VITE_API_URL;

export default function Upload() {
  const [previewImgUrls, setPreviewimgUrls] = useState<string[]>();
  const [previewAnswerImgUrls, setPreviewAnswerImgUrls] = useState<string[]>();
  const [isNextClicked, setIsNextClicked] = useState<boolean>(false);

  const difficulties = ["foundation", "crossover", "higher", "extended"];
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const files = event.target.files as FileList;
    if (!files) {
      return;
    }

    try {
      const filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(fileToDataString(files.item(i)!));
      }
      const imgUrls = await Promise.all(filePromises);
      if (isNextClicked) {
        setPreviewAnswerImgUrls(imgUrls);
        setValue("answerImages", imgUrls);
        return;
      }
      setPreviewimgUrls(imgUrls);
      setValue("images", imgUrls);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNext = () => {
    console.log("next");
    (document.getElementById("image-input") as HTMLInputElement).value = "";
    setIsNextClicked(true);
  };

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onload = () => resolve(reader.result as string);
    });
  };

  const form = useForm<UploadFormValues>({
    defaultValues: {
      difficulty: [],
      tags: undefined,
      images: undefined,
      answerImages: undefined,
    },
  });

  const { register, handleSubmit, setValue, watch } = form;

  const selectedTags = watch("tags");
  const query = useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      fetch(`${API_URL}/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  const postQuestions = async (data: UploadFormValues) => {
    const { tags, difficulty, images, answerImages } = data;
    const imagesToUpload = images.map((image: string, index) => {
      return {
        image,
        difficulty: difficulty[index],
        tags: tags[index],
        answerImage: answerImages[index],
      };
    });

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(imagesToUpload),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const questionIds = await response.json();
    if (!questionIds.length) {
      console.log("this shouldnt happen");

      throw Error("Error uploading questions");
    }
    console.log("returnedData: ", questionIds);
    return questionIds;
  };
  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: postQuestions,
  });

  const onSubmit = async (data: UploadFormValues) => {
    if (!selectedTags.length) return;
    for (let i = 0; i < selectedTags.length; i++) {
      if (!selectedTags[i]?.length) {
        const input = document.getElementById(
          `auto-search-${i}`,
        ) as HTMLInputElement;
        input.placeholder = "Please enter at least one tag";
        input.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        return;
      }
    }

    console.log("Uploaded Data:", data);
    mutate(data);
  };
  return (
    <>
      {isSuccess && (
        <div className="flex h-full flex-col justify-center gap-16 self-center">
          <h2 className="self-center text-3xl">Upload succesful.</h2>
          <div className="flex gap-2">
            <a
              href=""
              className="btn btn-lg"
              onClick={(e) => {
                e.preventDefault();
                setPreviewimgUrls([]);
                setPreviewAnswerImgUrls([])
                setIsNextClicked(false)
                reset();
                form.reset();
              }}
            >
              Start Again
            </a>
            <a
              href=""
              className="btn btn-lg"
              onClick={(e) => {
                e.preventDefault();

                navigate("/");
              }}
            >
              Home
            </a>
          </div>
        </div>
      )}
      {isPending && (
        <div className="flex h-full min-h-fit flex-col items-center justify-center">
          <Loader width={90} height={90} />
        </div>
      )}
      {!isPending && !isSuccess && (
        <form
          id="form"
          className="m-4 flex h-fit min-h-full flex-col gap-8 rounded-xl bg-base-100 p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-3xl">{`Upload ${isNextClicked?'Answers':'Questions'}`}</h2>
          <input
            id="image-input"
            className="file-input file-input-bordered h-10 min-h-10 w-80"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="flex items-center">
            <div className="flex max-h-full flex-col gap-2 object-contain">
              {!isNextClicked &&
                previewImgUrls?.map((previewImgUrl: string, index) => (
                  <div key={previewImgUrl + index} className="flex gap-2">
                    <img
                      className="max-h-36 w-52 max-w-52 rounded"
                      src={previewImgUrl}
                    />
                    <div className="flex flex-col">
                      <label htmlFor="difficulties"></label>
                      <select
                        required
                        id=""
                        className="h-8 rounded"
                        {...register(`difficulty.${index}`)}
                      >
                        {difficulties.map((difficulty, index2) => (
                          <option
                            key={difficulty + index + index2}
                            value={difficulty}
                          >
                            {difficulty}
                          </option>
                        ))}
                      </select>
                      <AutoCompleteSearch
                        tags={query?.data ?? ["error loading tags"]}
                        index={index}
                        setValue={setValue}
                        key={previewImgUrl + index}
                      />
                    </div>
                  </div>
                ))}
              {isNextClicked && (
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    {previewImgUrls?.map((previewImgUrl: string, index) => (
                      <div key={previewImgUrl + index} className="flex gap-2">
                        <img
                          className="max-h-36 w-52 max-w-52 rounded"
                          src={previewImgUrl}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {previewAnswerImgUrls?.map(
                      (previewImgUrl: string, index) => (
                        <div key={previewImgUrl + index} className="flex gap-2">
                          <img
                            className="max-h-36 w-52 max-w-52 rounded"
                            src={previewImgUrl}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {(previewImgUrls?.length ?? 0) > 0 &&
            (!isNextClicked ? (
              <a
                className={`btn btn-primary btn-lg mt-10 ${selectedTags?.every((tags) => tags.length > 0) ? "" : "btn-disabled"} relative bottom-4 w-[20%] self-center rounded-lg`}
                onClick={handleNext}
              >
                Next
              </a>
            ) : (
              (previewAnswerImgUrls?.length ?? 0) > 0 && (
                <button
                  className={`btn btn-primary btn-lg relative bottom-4 mt-10 w-[20%] self-center rounded-lg ${previewAnswerImgUrls?.length === previewImgUrls?.length ? "" : "btn-disabled"}`}
                >
                  Upload
                </button>
              )
            ))}
        </form>
      )}
    </>
  );
}
