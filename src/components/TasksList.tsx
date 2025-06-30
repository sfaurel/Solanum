import { useEffect, useState } from "react";
import { useBoardsStore } from "@stores/boardsStore";
import ArrowIcon from "@assets/ArrowIcon.svg";

interface Task {
  id: string;
  properties?: {
    Name?: {
      title: { plain_text: string }[];
    };
  };
};

interface OptionGroup {
    option: string;
    tasks: Task[];
}

interface BoardGroup {
    options: OptionGroup[];
}

export default function TaskList() {
    const selectedBoardId = useBoardsStore((state) => state.selectedBoardId);
    const selectTask = useBoardsStore((s) => s.selectTask);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [board, setBoard] = useState<BoardGroup[]>([]);
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        if (!selectedBoardId) {
            setBoard([]);
            return;
        }

        const fetchTasks = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/boards/${selectedBoardId}`, {
                    credentials: "include",
                });
                const data  = await response.json();
                setSelectedTaskId(null); 
                setBoard(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setBoard([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedBoardId]);

    if (loading) return <div className="p-4">Loading tasks...</div>;

    if (!selectedBoardId) {
        return <div className="p-4 text-midnight-500">Select a project to view tasks</div>;

    }

    const handleTaskClick = (task: Task) => {
        selectTask(task)
        setSelectedTaskId(task.id);
    };

    return (
        <ul className="space-y-2 font-medium">
            {board.map((groups, i) =>
                groups.options.map((option, j) => (
                    <li key={`group-${i}-opt-${j}`}>
                        <details className="group">
                            <summary 
                                className="group 
                                    flex items-center justify-between 
                                    px-2 py-2 rounded-lg cursor-pointer 
                                    text-midnight-900 hover:bg-midnight-100
                                    dark:text-white dark:hover:bg-midnight-700 
                            ">
                                <span className="flex items-center space-x-2">
                                    <svg
                                        className="w-4 h-4 text-midnight-400 group-open:rotate-90 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                    <span className="truncate">{option.option}</span>
                                </span>
                                <button
                                    className="
                                        flex items-center text-center 
                                        rounded-full aspect-square p-1.5  
                                        bg-midnight-400 
                                        dark:bg-midnight-600
                                        opacity-0 group-hover:opacity-100 transition-opacity
                                        cursor-pointer
                                    "
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        //TODO: preset new task status ${option.option}`)
                                        selectTask(null)
                                        setSelectedTaskId(null);
                                    }}
                                >
                                +
                            </button>
                            </summary>
                            <ul className="pl-6 mt-2 space-y-1">
                                {option.tasks.map((task, index) => {
                                    const taskName = task?.properties?.Name?.title?.[0]?.plain_text || "Unnamed Task";
                                    const isSelected = task.id === selectedTaskId;
                                    return (
                                    <li key={`task-${index}`}
                                        onClick={() => handleTaskClick(task)}
                                        className={`select-task w-full text-left flex items-center
                                            p-2 rounded-lg 
                                            focus:outline-none transition-colors duration-100 ease-in-out 
                                            cursor-pointer 
                                            ${isSelected
                                                ? "bg-midnight-200 dark:bg-midnight-600 font-semibold"
                                                : "text-midnight-900 active:bg-midnight-200 hover:bg-midnight-100 dark:text-white dark:hover:bg-midnight-700 dark:active:bg-midnight-600"
                                            }
                                        `}
                                    >
                                            {taskName}
                                    </li>
                                    )
                                })}
                            </ul>
                        </details>
                    </li>
                ))
            )}
        </ul>
    );
}
