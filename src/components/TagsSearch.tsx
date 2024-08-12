import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import CrossIcon from "./CrossIcon";
import { FormValues } from "./QuestionsForm";

interface TagsProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  register: UseFormRegister<FormValues>;

  setValue: UseFormSetValue<FormValues>;
}

export const TagsSearch = ({
  tags,
  setTags,
  setValue,
}: TagsProps) => {
  function removeTag(tags: string[], tag: string) {
    const index = tags.indexOf(tag);
    if (index === -1) return tags;
    return [...tags.slice(0, index), ...tags.slice(index + 1)];
  }

  return (
    <div className="flex flex-col px-4">
      <h2 className="text-2xl">Tags</h2>
      <div className="flex flex-col gap-3 p-2">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          onKeyDown={(e) => {
            const searchTerm: string = (
              document.getElementById("search") as HTMLInputElement
            ).value;
            if (e.key === "Enter") {
              e.preventDefault();
            }
            if (
              searchTerm.length &&
              e.key === "Enter" &&
              !tags.includes(searchTerm)
            ) {
              const newTags = [...tags, searchTerm];
              setTags(newTags);
              setValue("tags", newTags);
              (document.getElementById("search") as HTMLInputElement).value =
                "";
            }
          }}
        />
        <div className="flex flex-wrap max-w-56">
          {tags.map((tag: string) => (
            <a key={tag} className="badge">
              <CrossIcon
                onClick={() => {
                  const newTags = removeTag(tags, tag);
                  setTags(newTags);
                  setValue("tags", newTags);
                }}
              />
              {tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
