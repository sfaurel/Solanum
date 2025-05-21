import { useEffect, useRef, useState } from "react";
import { useBoardsStore } from '@stores/boardsStore'

export default function ProjectSwitcher() {
  const { boards, selectedBoardId, fetchBoards, selectBoard } = useBoardsStore()
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchBoards()
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }


    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, []);

  const handleSelect = (id) => {
    selectBoard(id);
    setOpen(false);
  };

  const selected = boards.find(b => b.id === selectedBoardId)

  return (
    <div className="w-full relative">
      <button
        className="flex items-center w-full p-2 rounded-lg bg-midnight-100 dark:bg-midnight-700"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="size-6 rounded-full bg-gray-500 mr-3"></div>
        <div className="text-left flex-1 truncate max-w-full">
          <div className="text-sm font-semibold">
            {selected?.name || "Select a project"}
          </div>
        </div>
        <div className="flex flex-col ml-auto">
          <svg
            className="size-4 text-midnight-400 -rotate-90"
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
          <svg
            className="size-4 text-midnight-400 rotate-90"
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
        </div>
      </button>

      
      <div
        className={`absolute z-10 w-full mt-1 rounded-lg shadow bg-midnight-300 dark:bg-midnight-700 transition-all duration-150 origin-top transform ${
          open ? "scale-y-100 opacity-100" : "scale-y-95 opacity-0 pointer-events-none"
        }`}
        style={{ transformOrigin: "top" }}
      >
        {boards.map(board => (
          <button
            key={board.id}
            onClick={() => handleSelect(board.id)}
            className="flex items-center w-full p-2 hover:bg-midnight-400"
          >
            <div className="size-6 rounded-full bg-gray-500 mr-3"></div>
            <div className="text-left truncate">
              <div className="text-sm font-semibold">{board.name}</div>
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}