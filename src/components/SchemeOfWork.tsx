import { useEffect, useState, useCallback } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import SchemeOfWorkSkeleton from "./SchemeOfWorkSkeleton";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

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
  const { token, user_role } = useAuth();
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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: { className: string; weeks: Week[] }) => {
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

      const result = await response.json();
      return {
        sow_id: result.sow_id,
        weeks: result.weeks,
      };
    },
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

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      const newWeeks = localWeeks.map(week => ({
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
  

  return (
    <div className="flex h-full max-h-full w-full max-w-[45vw] flex-grow flex-col self-center">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl">Scheme of Work</h2>
        {isSuccess && localWeeks.length > 0 && user_role &&(
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-full max-h-full w-full overflow-scroll rounded-xl p-4">
          {isSuccess && localWeeks.length > 0 ? (
            localWeeks.map((week, weekIndex) => (
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
                            : week.week_number >= +currentWeek - recallPeriod &&
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
                          <a
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`badge  h-8 min-w-fit ${isEditing ? "cursor-grab outline outline-1" : "cursor-default "}`}
                          >
                            {tag.replace(/-/g, " ")}
                          </a>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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
