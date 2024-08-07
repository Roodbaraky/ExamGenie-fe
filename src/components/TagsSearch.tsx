type TagSearchProps = {
  tags: string[];
  setTags: (tags: string[]) => void;
};
export default function TagsSearch({ tags, setTags }: TagSearchProps) {
  function removeTag(tags: string[], tag: string) {
    const index = tags.indexOf(tag);
    if (index === -1) return tags;

    return [...tags.slice(0, index), ...tags.slice(index + 1)];
  }

  return (
    <div className="flex flex-col px-4">
      <h3 className=" text-xl self-center">Tags</h3>
      <div className="flex flex-col gap-3 p-2">
        <label htmlFor="">
          Search
          <input
            type="text"
            id="search-field"
            onKeyDown={(e) => {
              const searchTerm = (
                document.getElementById("search-field") as HTMLInputElement
              ).value;
              if (searchTerm.length && e.key === "Enter") {
                setTags([...tags, searchTerm]);
                (
                  document.getElementById("search-field") as HTMLInputElement
                ).value = "";
              }
            }}
          />
          <div className="flex flex-wrap max-w-56">
            {tags ? (
              tags.map((tag: string) => (
                <a key={tag} className="badge">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block h-4 w-4 stroke-current"
                    onClick={() => {
                      const newTags = removeTag(tags, tag);
                      setTags(newTags);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  {tag}
                </a>
              ))
            ) : (
              <></>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
