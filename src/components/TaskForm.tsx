import { useState, useEffect } from 'react';
import { Dropdown, type Schema } from "@components/Dropdown.tsx";
import { useBoardsStore } from "@stores/boardsStore";
import { toast, Toaster } from 'sonner';

interface TaskFormProps {
    properties: {
        Status: Schema;
        Priority: Schema;
        Category: Schema;
    };
}

export default function TaskForm({ properties }: TaskFormProps) {
    const selectedBoardId = useBoardsStore((state) => state.selectedBoardId);
    const selectedTask = useBoardsStore((state) => state.selectedTask);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (selectedTask) {
            setFormData({
                name: selectedTask.properties.Name?.title[0]?.plain_text || '',
                status: selectedTask.properties.Status?.status?.name || '',
                priority: selectedTask.properties.Priority?.select?.name || '',
                category: selectedTask.properties.Category?.select?.name || '',
                startDate: selectedTask.properties["Start Date"]?.date?.start || '',
                deadline: selectedTask.properties.Deadline?.date?.start || '',
                description: selectedTask.properties.Description?.rich_text[0]?.plain_text || '',
                // comment: "Comments" 
            });
        }
    }, [selectedTask]);

    const handleChange = (field, value) => {
        setFormData((prev) => {
            if (prev[field] === value) {
                return { ...prev };
            }
            return { ...prev, [field]: value };
        });
    };


    async function handleSubmitForm(e: React.FormEvent) {
        e.preventDefault();

        if (selectedTask?.id) {
            editTask(selectedBoardId, selectedTask.id)
        }
        else {
            createTask(selectedBoardId)
        }
    }

    async function createTask(boardId: string) {
        const createTaskPromise = fetch(`/api/boards/${boardId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) throw new Error('Error adding new task.');
            return response.json();
        })

        toast.promise(createTaskPromise, {
            loading: 'Creating task…',
            success: 'New task added successfully!',
            error: 'Error adding new task.'
        });
    }

    async function editTask(boardId: string, taskId: string) {
        const updateTaskPromise = fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok) throw new Error('Error updating task.');
            return response.json();
        })

        toast.promise(updateTaskPromise, {
            loading: 'Updating task…',
            success: 'Task updated successfully!',
            error: 'Error updating new task.'
        });


        if (response.ok) {
            alert('Task edited successfully!');
        } else {
            alert('Error editing new task.');
            console.error(await response.text());
        }
    }

    function renderForm() {
        return (
            <>
                <Toaster />
                <form onSubmit={handleSubmitForm} className="pt-8 max-w-[90ch] w-full self-center">
                    <h2 className="text-white mb-5 text-2xl font-bold">{selectedTask ? selectedTask?.properties.Name?.title[0]?.plain_text || "Unnamed Task" : "New Task"}</h2>
                    <div className="flex gap-2 mb-5 items-center">
                        <label
                            htmlFor="task name"
                            className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Task Name
                        </label>
                        <input
                            type="text"
                            id="task name"
                            className="bg-midnight-50 border border-midnight-300 text-midnight-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Task Name"
                            required
                            value={formData["name"] || ''}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 mb-5 items-center">
                        <label
                            htmlFor="status"
                            className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Status
                        </label>
                        <Dropdown
                            key="status"
                            schema={properties.Status}
                            placeholder="Select status"
                            onChange={(selected) => { handleChange("status", selected.name) }}
                            selected={formData["status"] || ''}
                        />
                    </div>
                    <div className="flex gap-2 mb-5 items-center">
                        <label
                            htmlFor="priority"
                            className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Priority
                        </label>
                        <Dropdown
                            key="priority"
                            schema={properties.Priority}
                            placeholder="Select priority"
                            onChange={(selected) => handleChange("priority", selected.name)}
                            selected={formData["priority"] || ''}
                        />
                    </div>
                    {/* TODO: add assign*/}
                    <div className="flex gap-2 mb-5 items-center">
                        <label
                            htmlFor="category"
                            className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Category</label
                        >
                        <Dropdown
                            key="category"
                            schema={properties.Category}
                            placeholder="Select category"
                            onChange={(selected) => handleChange("category", selected.name)}
                            selected={formData["category"] || ''}

                        />
                    </div>
                    <div className="flex gap-2 mb-5 items-center">
                        <label
                            htmlFor="start date"
                            className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Start Date</label
                        >
                        <input
                            type="date"
                            id="start date"
                            className="bg-midnight-50 border border-midnight-300 text-midnight-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData["startDate"] || ''}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 mb-5 items-center">
                        <label
                            htmlFor="deadline"
                            className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Deadline
                        </label>
                        <input
                            type="date"
                            id="deadline"
                            className="bg-midnight-50 border border-midnight-300 text-midnight-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={formData["deadline"] || ''}
                            onChange={(e) => handleChange("deadline", e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            className="block p-2.5 w-full text-sm text-midnight-900 bg-midnight-50 rounded-lg border border-midnight-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Task description..."
                            value={formData["description"] || ''}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>
                    {/* <div className="flex flex-col gap-2 mb-5">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                        >Comments</label
                        >
                        <textarea
                            id="comment"
                            rows={4}
                            className="block p-2.5 w-full text-sm text-midnight-900 bg-midnight-50 rounded-lg border border-midnight-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Write a comment..."
                        />
                    </div> */}
                    <button
                        type="submit"
                        className="rounded-lg w-full sm:w-auto px-5 py-2.5
                            text-white text-sm text-center font-medium 
                            transition transform focus:scale-95
                            bg-blue-700 hover:bg-blue-800
                            dark:bg-blue-600 dark:hover:bg-blue-700
                            disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300
                        "
                    >{selectedTask?.id ? "Edit" : "Create"}
                    </button>
                </form>
            </>
        );
    }

    function renderNoBoardSelected() {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
                <h2 className="text-midnight-900 dark:text-white text-2xl font-bold mb-3">No Board Selected</h2>
                <p className="text-midnight-600 dark:text-midnight-300 text-base">Please select a board to create or edit tasks.</p>
            </div>
        );
    }

    return (
        selectedBoardId
            ? renderForm()
            : renderNoBoardSelected()
    );
}