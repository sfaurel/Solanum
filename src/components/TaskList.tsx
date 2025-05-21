import { useEffect, useState } from "react";
import { useBoardsStore } from "@stores/boardsStore";
import ArrowIcon from "@assets/ArrowIcon.svg";

interface Task {
    properties?: {
        Name?: {
            title: { plain_text: string }[];
        };
    };
}

interface OptionGroup {
    option: string;
    tasks: Task[];
}

interface BoardGroup {
    options: OptionGroup[];
}

export default function TaskList() {
    const selectedBoardId = useBoardsStore((state) => state.selectedBoardId);
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
                const board = await response.json();
                setBoard(board);
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

    return (
        <ul className="space-y-2 font-medium">
            {board.map((groups, i) =>
                groups.options.map((option, j) => (
                    <li key={`group-${i}-opt-${j}`}>
                        <details className="group">
                            <summary className="flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer text-midnight-900 dark:text-white hover:bg-midnight-100 dark:hover:bg-midnight-700">
                                <span className="flex items-center space-x-2">
                                    <ArrowIcon className="w-4 h-4 text-midnight-400 group-open:rotate-90 transition-transform" />
                                    <span className="truncate">{option.option}</span>
                                </span>
                                <button className="text-sm text-midnight-600 dark:text-midnight-200 hover:underline">
                                    ⋮
                                </button>
                            </summary>
                            <ul className="pl-6 mt-2 space-y-1">
                                {option.tasks.map((task, index) => (
                                    <li key={`task-${index}`}>
                                        <button
                                            type="button"
                                            data-task={JSON.stringify(task)}
                                            className="select-task w-full text-left flex items-center p-2 rounded-lg text-midnight-900 dark:text-white hover:bg-midnight-100 dark:hover:bg-midnight-700 focus:outline-none cursor-pointer active:bg-midnight-200 dark:active:bg-midnight-600 transition-colors duration-100 ease-in-out"
                                        >
                                            {task?.properties?.Name?.title?.[0]?.plain_text || "Unnamed Task"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </li>
                ))
            )}
        </ul>
    );
}
