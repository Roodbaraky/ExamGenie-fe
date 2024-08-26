import { useEffect, useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { FormValues } from "./QuestionsForm";
import SchemeOfWorkSkeleton from "./SchemeOfWorkSkeleton";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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
  onUpdateWeeks: (updatedWeeks: Week[]) => void;
}

export default function SchemeOfWork({
  weeks,
  watch,
  isSuccess,
  isLoading,
  onUpdateWeeks,
}: SchemeOfWorkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localWeeks, setLocalWeeks] = useState(weeks);
  const { token } = useAuth();
  const currentWeek = watch("currentWeek");
  const recallPeriod = watch("recallPeriod");
  const className = watch("className");

  useEffect(() => {
    setLocalWeeks(weeks);
  }, [weeks]);

  useEffect(() => {
    document.getElementById(`${currentWeek}`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [currentWeek]);

  const {
    mutateAsync,
    isPending,
    isSuccess: isMutateSuccess,
    data,
    isError,
    error,
    reset,
  } = useMutation({
    mutationFn: async (data: { className: string, weeks:Week[] }) => {
      const apiURL = `${API_URL}/sow`;

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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
    const newWeeks = Array.from(localWeeks);
    const sourceIndex = parseInt(source.droppableId, 10);
    const destIndex = parseInt(destination.droppableId, 10);
    const [reorderedTag] = newWeeks[sourceIndex].tags.splice(source.index, 1);
    newWeeks[destIndex].tags.splice(destination.index, 0, reorderedTag);
  
    setLocalWeeks(newWeeks);
  };

  const handleSave = async () => {
    try {
      await mutateAsync({ className: watch("className"), weeks: localWeeks });
      onUpdateWeeks(localWeeks);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating backend:', error);
    }
  };

  return (
    <div className="flex h-full max-h-full w-full max-w-[45vw] flex-grow flex-col self-center">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl">Scheme of Work</h2>
      {isSuccess && localWeeks?.length > 0 && (
        <div>
          {isEditing ? (
            <a onClick={handleSave} className="btn btn-primary mr-2">Save</a>
          ) : (
            <a onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit</a>
          )}
        </div>
      )}
    </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-full max-h-full w-full overflow-scroll rounded-xl p-4">
          {isSuccess && localWeeks?.length > 0 ? (
            localWeeks?.map((week: Week, weekIndex) => (
              <Droppable key={week.week_number} droppableId={weekIndex.toString()}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-nowrap gap-4 p-1"
                  >
                    <div id={`${week.week_number}`}>
                      <p
                        className={`p-1 ${
                          week?.week_number === +currentWeek
                            ? "badge-success rounded-full"
                            : week.week_number >= currentWeek - recallPeriod &&
                                week.week_number < currentWeek
                              ? "rounded-full backdrop-brightness-90"
                              : ""
                        } w-fit text-nowrap`}
                      >
                        {" "}
                        Week {week.week_number}:
                      </p>
                    </div>
                    {week?.tags?.map((tag, index) => (
                <Draggable key={tag} draggableId={tag} index={index} isDragDisabled={!isEditing}>
                {(provided) => (
                  <a
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`btn ${isEditing ? '' : 'cursor-default'}`}
                  >
                    {tag.replace(/-/g, " ")}
                  </a>
                )}
              </Draggable>
                    ))}
                    <a
                      key={"plus-btn"}
                      className="btn btn-outline"
                      onClick={() => {
                        // Implement add tag functionality here
                      }}
                    >
                      +
                    </a>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))
          ) : !isLoading && className.length > 0 ? (
            <div className="flex h-full flex-col items-center justify-center self-center text-center">
              No scheme of work found for this class.
            </div>
          ) : (
            !isLoading && (
              <div className="flex h-full flex-col items-center justify-center self-center text-center">
                Select a class to load scheme of work
              </div>
            )
          )}
          {isLoading && <SchemeOfWorkSkeleton />}
        </div>
      </DragDropContext>
    </div>
  );
}