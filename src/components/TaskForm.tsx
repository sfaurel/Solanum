import { useState, useEffect } from 'react';
import { Dropdown } from "../components/Dropdown.tsx";
import { useBoardsStore } from "@stores/boardsStore";


export default function TaskForm({ properties }) {
    const selectedBoardId = useBoardsStore((s) => s.selectedBoardId);
    const selectedTask = useBoardsStore((s) => s.selectedTask);
    const [formData, setFormData] = useState({});

    useEffect(() => {
      if (selectedTask) {
        setFormData({
            name: selectedTask.properties.Name?.title[0]?.plain_text || '',
            status: selectedTask.properties.Status?.select?.name || '',
            priority: selectedTask.properties.Priority?.select?.name || '',
            category: selectedTask.properties.Category?.select?.name || '',
            startDate: selectedTask.properties["Start Date"]?.date?.start || '',
            deadline: selectedTask.properties.Deadline?.date?.start || '',
            description: selectedTask.properties.Description?.rich_text[0]?.plain_text || '',
            // comment: "Comments" 
        });
      }
    }, [selectedTask]);
     
    const handleChange = (nombre, valor) => {
        setFormData((prev) => ({ ...prev, [nombre]: valor }));
    };


    async function handleSubmitForm() {
        if (selectedTask) {
            editTask(selectedBoardId, selectedTask.id)
        }
        else {
            createTask(selectedBoardId)
        }
    }

    async function createTask(boardId: string) {
        const response = await fetch(`/api/boards/${boardId}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('New task added successfully!');
        } else {
            alert('Error adding new task.');
            console.error(await response.text());
        }
    }

    async function editTask(boardId: string, taskId: string) {
        const response = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });


        if (response.ok) {
            alert('Task edited successfully!');
        } else {
            alert('Error editing new task.');
            console.error(await response.text());
        }
    }


    return (
        <form className="pt-8 max-w-[90ch] w-full self-center">
            <h2 className="text-white mb-5 text-2xl font-bold">{selectedTask ? selectedTask?.properties.Name?.title[0]?.plain_text || "Unnamed Task" : "New Task"}</h2>
            <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="task name"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Task Name</label
                >
                <input
                    type="text"
                    id="task name"
                    className="bg-midnight-50 border border-midnight-300 text-midnight-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Task Name"
                    required
                    value={formData["name"] || ''}
                    onChange={(e) => handleChange("name", e.target.value)}
                    // defaultValue={selectedTask?.properties.Name?.title[0]?.plain_text || ''}
                />
            </div>
            <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="status"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Status</label
                >
                <Dropdown
                    key="status"
                    schema={properties.Status}
                    placeholder="Select status"
                    onChange={(selected) => handleChange("status", selected)}
                />
            </div>
            <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="priority"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Priority</label
                >
                <Dropdown
                    key="priority"
                    schema={properties.Priority}
                    placeholder="Select priority"
                    onChange={(selected) => handleChange("priority", selected)}    
                />

            </div>
            {/* <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="assign"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Assign</label
                >
                <Dropdown key="assignee" options={statusOptions} placeholder="Select assignee" /> 
            </div> */}
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
                    onChange={(selected) => handleChange("category", selected)}
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
                    // defaultValue={selectedTask?.properties["Start Date"]?.date?.start || ''}
                />
            </div>
            <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="deadline"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Deadline</label
                >
                <input
                    type="date"
                    id="deadline"
                    className="bg-midnight-50 border border-midnight-300 text-midnight-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData["deadline"] || ''}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    // defaultValue={selectedTask?.properties.Deadline?.date?.start || ''}
                />
            </div>
            <div className="flex flex-col gap-2 mb-5">
                <label
                    htmlFor="description"
                    className="block text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Description</label
                >
                <textarea
                    id="description"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-midnight-900 bg-midnight-50 rounded-lg border border-midnight-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-midnight-700 dark:border-midnight-600 dark:placeholder-midnight-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Task description..."
                    value={formData["description"] || ''}
                    onChange={(e) => handleChange("description", e.target.value)}
                    // defaultValue={selectedTask?.properties.Description?.rich_text[0]?.plain_text || ''}
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
                onClick={handleSubmitForm}
            >{selectedTask ? "Edit" : "Create"}
            </button>
        </form>
    );
}