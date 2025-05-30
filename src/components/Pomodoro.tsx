import { useState, useEffect, useRef } from 'react';

import Countdown from './Countdown.tsx';
import { Toaster, toast } from 'sonner'
import bell from "@assets/bell.mp3";
import { useBoardsStore } from "@stores/boardsStore";

const defaultSessionDuration = .5


export default function Pomodoro() {
  const [paused, setPaused] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedTask = useBoardsStore((s) => s.selectedTask);
  const [sessionDuration, setSessionDuration] = useState(defaultSessionDuration)
  useEffect(() => {
    audioRef.current = new Audio(bell);
  }, []);

  const toggle
    = () => setPaused((prev) => !prev);

  function MyIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.22 8.22 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.72 9.72 0 0 0 19.266 2.5Z" />
        <path
          fillRule="evenodd"
          d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  function onCountEnd() {
    audioRef.current?.play();
    toast('Focus time ended, register or discard?', {
      duration: Infinity,
      invert: true,
      action: {
        label: 'Register',
        onClick: updateTask
      },
      cancel: {
        label: 'Cancel',
        onClick: () => { }
      },
      icon: <MyIcon />
    })
  }

  async function updateTask() {
    let taskId = selectedTask?.id;
    if (taskId) {
      const response = await fetch(`/api/boards/123/tasks/${taskId}/focus_sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          duration: 25,
          user: 'juan.perez'
        }),
      });

      if (response.ok) {
        alert('Focus session logged successfully!');
      } else {
        alert('Error logging focus session.');
        console.error(await response.text());
      }
    }
    else {
      alert('No task selected');
    }
  }

  function handleReset(){
    setSessionDuration(defaultSessionDuration)
  }

  return (
    <section
      className=" max-h-40
        fixed bottom-4 left-4 right-4 bg-white shadow-lg p-4 z-50
        flex rounded-md items-center gap-2 bg-midnight-50 dark:bg-midnight-700 
      "
    >
      <Toaster />
      {/* play button */}
      <div className="relative">
        <label
          htmlFor="play-toggle"
          className="size-24 flex items-center justify-center rounded-full bg-midnight-200 dark:bg-midnight-600 hover:bg-midnight-300 hover:dark:bg-midnight-500 cursor-pointer"
        >
          <input
            type="checkbox"
            id="play-toggle"
            className="hidden peer"
            checked={!paused}
            onChange={toggle}
          />
          <svg
            className="w-10 h-10 text-white peer-checked:hidden"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3v18l15-9L5 3z"></path>
          </svg>
          <svg
            className="w-10 h-10 text-white hidden peer-checked:block"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
          </svg>
        </label>

      </div>
      <div className="flex flex-col items-center w-full">
        <p className="text-2xl">{selectedTask?.properties.Name?.title[0]?.plain_text || 'No task selected'}</p>
        <Countdown
          className="px-4 text-6xl pb-2 font-semibold text-midnight-900 dark:text-white"
          paused={paused}
          durationMinutes={sessionDuration}
          onFinish={onCountEnd}
        />
        <p><span
          className="rounded-full max-w-fit px-2 pb-1 bg-midnight-200 dark:bg-midnight-600 hover:bg-midnight-300 hover:dark:bg-midnight-500"
        >
          Focus
        </span> time
        </p>
      </div>
      <div className="flex flex-col max-w-28 w-full space-y-4">
        <button
          disabled
          className="
              flex items-center justify-center w-full pb-1 
              rounded-md cursor-pointer text-white transition
              bg-midnight-200  hover:bg-midnight-300
              dark:bg-midnight-600 hover:dark:bg-midnight-500 
              disabled:bg-gray-600 disabled:text-gray-500 disabled:hover:bg-gray-600 disabled:cursor-default
            "
          title="Reset timer"
        // onClick={handleReset}
        >
          Edit task
        </button>
        <button
          disabled
          className="
              flex items-center justify-center w-full pb-1 
              rounded-md cursor-pointer text-white transition
              bg-midnight-200  hover:bg-midnight-300
              dark:bg-midnight-600 hover:dark:bg-midnight-500 
              disabled:bg-gray-600 disabled:text-gray-500 disabled:hover:bg-gray-600 disabled:cursor-default
            "
          title="Reset timer"
        onClick={handleReset}
        >
          Reset Timer
        </button>
        <button
          disabled
          className="
              flex items-center justify-center w-full pb-1
              rounded-md cursor-pointer text-white transition
              bg-midnight-200  hover:bg-midnight-300
              dark:bg-midnight-600 hover:dark:bg-midnight-500 
              disabled:bg-gray-600 disabled:text-gray-500 disabled:hover:bg-gray-600 disabled:cursor-default
            "
          title="Reset timer"
        // onClick={handleReset}
        >
          Finish Task
        </button>
      </div>
    </section>
  );
}
