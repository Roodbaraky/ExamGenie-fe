import { createClient } from "@supabase/supabase-js";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../utils/supabaseClient";

interface Tag {
  id: number;
  tag: string;
  category: string;
}
export default function Upload() {
  const [selectedImages, setSelectedImages] = useState<FileList>();
  const [previewImgUrls, setPreviewimgUrls] = useState<string[]>();
  const [tags, setTags] = useState<Tag[]>();
  const difficulties = ["foundation", "crossover", "higher", "crossover"];

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
  const populateTags = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/tags`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const tags = await response.json();
      setTags(tags);
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  useEffect(() => {
    populateTags();
  }, []);

  interface UploadFormValues {
    difficulty: string;
    tags: Record<string, string>;
  }

  const form = useForm<UploadFormValues>({
    defaultValues: {
      difficulty: "",
      tags: {},
    },
  });

  const { register, handleSubmit, setValue } = form;

  const postQuestions = async (data: UploadFormValues) => {
    const { tags, difficulty } = data;
    const newTags = Object.entries(tags)
      .filter(([key, value]) => value)
      .map((x) => x[0]);
    const newQObject = {
      tags: newTags,
      difficulty,
    };

    const response = await fetch(`http://127.0.0.1:3001/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newQObject]),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const questionIds = await response.json();
    console.log(questionIds);
    for (const questionId of questionIds) {
      const { data, error } = await supabase.storage
        .from("questions")
        .upload(`public/${questionId}.png`, selectedImages![0]);

      if (error) {
        console.error(
          `Error uploading image for question ${questionId}:`,
          error
        );
      } else {
        console.log(
          `Successfully uploaded image for question ${questionId}:`,
          data
        );
      }
    }
  };
  const onSubmit = async (data: UploadFormValues) => {
    console.log("Uploaded Data:", data);
    try {
      //   const tags = form.getValues("tags");
      //   const difficulty = form.getValues("difficulty");
      await postQuestions(data);
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
        <h2 className="text-2xl">Upload</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <div className="flex gap-2">
          {previewImgUrls && (
            <>
              <img className="max-w-52" src={previewImgUrls[0]} />
              <label htmlFor="difficulties"></label>
              <select id="" {...register("difficulty")}>
                {difficulties.map((difficulty) => (
                  <option value={difficulty}>{difficulty}</option>
                ))}
              </select>
              {tags?.map((tag) => (
                <>
                  <label htmlFor="tags"></label>
                  <input
                    type="checkbox"
                    id={tag.tag}
                    {...register(`tags.${tag.tag}`)}
                  />
                </>
              ))}
            </>
          )}
          {(previewImgUrls?.length ?? 0) > 0 && (
            <button className="btn">Upload</button>
          )}
        </div>
      </form>
      {/* {previewImgUrls &&
          previewImgUrls
          .map((imgURL, index) => (
            <div className="flex gap-2" id="image_wrapper">
              <img className="w-96" src={imgURL} />

              {/* <Stack>
                      <Autocomplete
                        id="tag-search"
                        freeSolo
                        options={tags ? tags.map((option) => option.tag) : []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search input"
                            InputProps={{
                              ...params.InputProps,
                              type: "search",
                            }}
                          />
                        )}
                          />
                          </Stack> */}
      {/* <div className="flex flex-col max-h-48 overflow-scroll" >
                  {tags?.map((tag) => (
                    <div key={tag.id + index} className="flex flex-col">
                      <label htmlFor={tag.tag}>{tag.tag}</label>
                      <input
                        className="btn w-20 self-center"
                        type="checkbox"
                        id={tag.tag}
                        name={tag.tag + index}
                        value={tag.tag}
     */}
      {/* // {...register(`difficulties.${difficulty}`)} */}
      {/* />
                    </div>
                  ))}
              </div>

              <div className="flex gap-2">
                {difficulties.map((difficulty: string) => (
                  <div key={difficulty + index} className="flex flex-col">
                    <label htmlFor={difficulty}>{difficulty}</label>
                    <input
                      className="btn"
                      type="radio"
                      id={difficulty}
                      name={"difficulty" + index}
                      value={difficulty}

                      // {...register(`difficulties.${difficulty}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))} */}
      {/* </div>  */}
    </>
  );
}
