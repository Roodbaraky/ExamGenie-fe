import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CustomizedHook from "../components/AutocompleteSearch";
import { Tag, UploadFormValues } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

export default function Upload() {
  const [, setSelectedImages] = useState<FileList>();
  const [previewImgUrls, setPreviewimgUrls] = useState<string[]>();
  const [tags, setTags] = useState<Tag[]>();
  const [uploadStatus, setUploadStatus] = useState({
    notStarted: true,
    pending: false,
    success: false,
  });
  const difficulties = ["foundation", "crossover", "higher", "crossover"];
  const { token } = useAuth();

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const files = event.target.files as FileList;
    setSelectedImages(files);
    if (!files) {
      return;
    }
    try {
      const filePromises = [];
      for (let i = 0; i < files.length; i++) {
        filePromises.push(fileToDataString(files.item(i)!));
      }
      const imgUrls = await Promise.all(filePromises);
      setPreviewimgUrls(imgUrls);
      setValue("images", imgUrls);
    } catch (error) {
      console.log(error);
    }
  };

  const fileToDataString = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onload = () => resolve(reader.result as string);
    });
  };
  const populateTags = useCallback( async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const tags = await response.json();
      setTags(tags);
    } catch (error) {
      console.error((error as Error).message);
    }
  },[token])

  useEffect(() => {
    populateTags();
  }, [populateTags]);

  const form = useForm<UploadFormValues>({
    defaultValues: {
      difficulty: [],
      tags: undefined,
      images: undefined,
    },
  });

  const { register, handleSubmit, setValue } = form;

  const postQuestions = async (data: UploadFormValues) => {
    const { tags, difficulty, images } = data;
    const imagesToUpload = images.map((image: string, index) => {
      return {
        image,
        difficulty: difficulty[index],
        tags: tags[index],
      };
    });

    const response = await fetch(`http://127.0.0.1:3001/upload`, {
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
      setUploadStatus({ ...uploadStatus, pending: false, notStarted: true });

      throw Error("Error uploading questions");
    } else {
      setUploadStatus({ success: true, pending: false, notStarted: false });
    }
  };
  const onSubmit = async (data: UploadFormValues) => {
    console.log("Uploaded Data:", data);
    try {
      setUploadStatus({ ...uploadStatus, pending: true, notStarted: false });
      await postQuestions(data);
    } catch (error) {
      console.error((error as Error).message);
    }
  };
  return (
    <>
      {uploadStatus.success && <h2>Success</h2>}
      {uploadStatus.pending && <Loader width={90} height={90}/>}
      {uploadStatus.notStarted && (
        <form
          id="form"
          className="flex flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl">Upload</h2>
          <input
            type="file"
            accept="image/*"
            multiple
            //see if it works with RHF just?
            //   {...register("image")}
            onChange={handleFileChange}
          />
          <div className="flex flex-col gap-2">
            {previewImgUrls?.map((previewImgUrl: string, index) => (
              <div key={previewImgUrl + index} className="flex">
                <img className="max-w-52" src={previewImgUrl} />
                <div className="flex flex-col">
                  <label htmlFor="difficulties"></label>
                  <select id="" {...register(`difficulty.${index}`)}>
                    {difficulties.map((difficulty, index2) => (
                      <option
                        key={difficulty + index + index2}
                        value={difficulty}
                      >
                        {difficulty}
                      </option>
                    ))}
                  </select>
                  <CustomizedHook
                    tags={tags ?? []}
                    index={index}
                    setValue={setValue}
                    key={previewImgUrl + index}
                  />
                </div>
              </div>
            ))}
            {(previewImgUrls?.length ?? 0) > 0 && (
              <button className="btn">Upload</button>
            )}
          </div>
        </form>
      )}
    </>
  );
}
