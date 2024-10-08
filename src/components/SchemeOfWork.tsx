import { useEffect, useState, useCallback, MouseEvent } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import SchemeOfWorkSkeleton from "./SchemeOfWorkSkeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Tag } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL;

export interface Week {
  week_number: number;
  tags: string[];
}

interface SchemeOfWorkProps {
  weeks: Week[];
  watch: UseFormWatch<FormValues>;
  isSuccess: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export default function SchemeOfWork({
  weeks,
  watch,
  isSuccess,
  isLoading,
  refetch,
}: SchemeOfWorkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localWeeks, setLocalWeeks] = useState<Week[]>([]);
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(true);

  const auth = useAuth();
  const currentWeek = watch("currentWeek");
  const recallPeriod = watch("recallPeriod");
  const className = watch("className");

  useEffect(() => {
    if (Array.isArray(weeks)) {
      const sortedWeeks = [...weeks].sort(
        (a, b) => a.week_number - b.week_number,
      );
      setLocalWeeks(sortedWeeks);
    }
  }, [weeks]);

  useEffect(() => {
    const element = document.getElementById(`week-${currentWeek}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [currentWeek]);

  useEffect(() => {
    setIsEditing(false);
  }, [className]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: { className: string; weeks: Week[] }) => {
      const token = auth.token;
      const response = await fetch(`${API_URL}/sow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      const result = await response?.json();
      if (result) console.log(result);
      return {
        sow_id: result.sow_id,
        weeks: result.weeks,
      };
    },
  });

  const query = useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      fetch(`${API_URL}/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }).then((res) => res.json()),
  });

  const compareWeekTagsArrays = (arr1: Week[], arr2: Week[]) => {
    return arr1.every((week: Week, index: number) => {
      const tags1 = week.tags;
      const tags2 = arr2[index]?.tags;
      return tags1.every((tag) => tags2.includes(tag));
    });
  };
  const handleSave = async () => {
    const warning = document.getElementById("weeks-warning") as HTMLDivElement;
    if (!localWeeks.every((week) => week?.tags?.length > 0)) {
      console.error("Cannot save with empty weeks");
      warning.classList.replace("opacity-0", "opacity-100");
      return;
    }
    warning.classList.replace("opacity-100", "opacity-0");
    if (compareWeekTagsArrays(weeks, localWeeks)) {
      setIsEditing(false);
      return;
    }
    try {
      await mutateAsync({ className, weeks: localWeeks });
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  };
  const onDragStart = useCallback(() => {
    setIsDropdownVisible(false);
    setIsDeleteVisible(false);
  }, []);
  const onDragEnd = useCallback(
    (result: DropResult) => {
      setIsDeleteVisible(true);
      if (!result.destination) return;
      const { source, destination } = result;
      const newWeeks = localWeeks.map((week) => ({
        ...week,
        tags: [...week.tags],
      }));
      const sourceIndex = parseInt(source.droppableId, 10);
      const destIndex = parseInt(destination.droppableId, 10);
      const [reorderedTag] = newWeeks[sourceIndex].tags.splice(source.index, 1);
      newWeeks[destIndex].tags.splice(destination.index, 0, reorderedTag);
      setLocalWeeks(newWeeks);
    },
    [localWeeks],
  );
  const handleAdd = (e: MouseEvent) => {
    const weekNumber = +(e.target as HTMLAnchorElement).id;
    setActiveWeek(weekNumber);
    setIsDropdownVisible(true);
  };

  const handleAddTag = () => {
    const newTag = (
      document.getElementById("tag-selector") as HTMLSelectElement
    ).value;
    const newWeeks = localWeeks.map((week, index) => {
      if (index === activeWeek) {
        return {
          ...week,
          tags: [...week.tags, newTag],
        };
      }
      return week;
    });
    setLocalWeeks(newWeeks);
  };

  const handleRemoveTag = (e: MouseEvent) => {
    const delId = (e.target as HTMLAnchorElement).id;
    const [weekIndex, tagIndex] = delId.split("-");
    const newWeeks = localWeeks.map((week, index) => {
      if (index === +weekIndex) {
        const newTags = week.tags.filter((_, tagIdx) => tagIdx !== +tagIndex);
        return {
          ...week,
          tags: newTags,
        };
      }
      return week;
    });
    setLocalWeeks(newWeeks);
  };

  return (
    <div className="flex h-full max-h-full w-full max-w-[45vw] flex-grow flex-col self-center">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl">Scheme of Work</h2>
        {isSuccess && localWeeks.length > 0 && auth.user_role && (
          <div>
            {isEditing ? (
              isPending ? (
                <a className="btn btn-primary">
                  <span className="loading loading-spinner"></span>
                </a>
              ) : (
                <>
                  <div
                    id="weeks-warning"
                    className="tooltip tooltip-left tooltip-open opacity-0"
                    data-tip="Cannot save with empty weeks"
                  ></div>
                  <a onClick={handleSave} className="btn btn-primary">
                    Save
                  </a>
                </>
              )
            ) : (
              <a
                onClick={() => setIsEditing(true)}
                className="btn btn-secondary"
              >
                Edit
              </a>
            )}
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="h-full max-h-full w-full overflow-scroll rounded-xl p-4">
          {isSuccess && localWeeks.length > 0 ? (
            localWeeks.map((week, weekIndex) => (
              <div
                className="flex flex-wrap items-center"
                key={`week-${week.week_number}`}
              >
                <Droppable
                  key={`week-${week.week_number}`}
                  droppableId={weekIndex.toString()}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex flex-nowrap gap-4 p-1"
                    >
                      <div id={`week-${week.week_number}`}>
                        <p
                          className={`p-1 ${
                            week.week_number === +currentWeek
                              ? "badge-success rounded-full"
                              : week.week_number >=
                                    +currentWeek - recallPeriod &&
                                  week.week_number < +currentWeek
                                ? "rounded-full backdrop-brightness-90"
                                : ""
                          } w-fit text-nowrap`}
                        >
                          Week {week.week_number}:
                        </p>
                      </div>
                      {week.tags.map((tag, index) => (
                        <Draggable
                          key={`${week.week_number}-${tag}`}
                          draggableId={`${week.week_number}-${tag}`}
                          index={index}
                          isDragDisabled={!isEditing}
                        >
                          {(provided) => (
                            <div className="indicator">
                              <a
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`badge h-8 min-w-fit ${isEditing ? "cursor-grab outline outline-1" : "cursor-default"}`}
                              >
                                {tag.replace(/-/g, " ")}
                              </a>
                              {isEditing && isDeleteVisible && (
                                <a
                                  id={`${weekIndex}-${index}`}
                                  className="badge indicator-item badge-secondary cursor-pointer"
                                  onClick={handleRemoveTag}
                                >
                                  x
                                </a>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                {isEditing &&
                  (isDropdownVisible && activeWeek === weekIndex ? (
                    <>
                      <select id="tag-selector">
                        {query.data?.map((tag: Tag) => (
                          <option key={`${weekIndex}-${tag.tag}`}>
                            {tag.tag}
                          </option>
                        ))}
                      </select>
                      <a className="btn" onClick={handleAddTag}>
                        Add
                      </a>
                    </>
                  ) : (
                    isDeleteVisible && (
                      <a
                        className="btn"
                        onClick={handleAdd}
                        id={`${weekIndex}`}
                      >
                        +
                      </a>
                    )
                  ))}
              </div>
            ))
          ) : !isLoading ? (
            <div className="flex h-full flex-col items-center justify-center self-center text-center">
              {className
                ? "No scheme of work found for this class."
                : "Select a class to load scheme of work"}
            </div>
          ) : (
            <SchemeOfWorkSkeleton />
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
