import { useState, useEffect } from 'react';
import { Dropdown } from "../components/Dropdown.tsx";
import { useBoardsStore } from "@stores/boardsStore";


export default function TaskForm({ properties }) {
    const selectedTask = useBoardsStore((s) => s.selectedTask);

    return (
        <form className="pt-8">
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
                    defaultValue={selectedTask?.properties.Name?.title[0]?.plain_text || ''}
                />
            </div>
            <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="status"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Status</label
                >
                <Dropdown key="status" schema={properties.Status} placeholder="Select status" />
            </div>
            <div className="flex gap-2 mb-5 items-center">
                <label
                    htmlFor="priority"
                    className="w-32 text-sm font-medium text-nowrap text-midnight-900 dark:text-white"
                >Priority</label
                >
                <Dropdown key="status" schema={properties.Priority} placeholder="Select priority" />

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
                <Dropdown key="status" schema={properties.Category} placeholder="Select category" />
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
                    required
                    defaultValue={selectedTask?.properties["Start Date"]?.date?.start || ''}
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
                    required
                    defaultValue={selectedTask?.properties.Deadline?.date?.start || ''}
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
                    defaultValue={selectedTask?.properties.Description?.rich_text[0]?.plain_text || ''}
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
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >{selectedTask ? "Edit" : "Create"}
            </button>
        </form>
    );
}