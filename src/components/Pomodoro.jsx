import { useState } from 'react';
import Countdown from './Countdown.jsx';

export default function TimerWrapper() {
  const [paused, setPaused] = useState(true);

  const toggle = () => setPaused((prev) => !prev);


  return (
    <section
      class="flex flex-col rounded-md gap-2 bg-midnight-50 dark:bg-midnight-700 p-2"
    >
      <span
        class="rounded-full max-w-fit px-4 bg-midnight-200 dark:bg-midnight-600 hover:bg-midnight-300 hover:dark:bg-midnight-500"
      >
        Focus
      </span>
      <div class="flex items-center">

        <div class="relative">
          <label
            for="play-toggle"
            class="flex items-center justify-center size-24 rounded-full bg-midnight-200 dark:bg-midnight-600 hover:bg-midnight-300 hover:dark:bg-midnight-500 cursor-pointer"
          >
            <input
              type="checkbox"
              id="play-toggle"
              className="hidden peer"
              checked={!paused}
              onChange={toggle}
            />
            <svg
              class="w-10 h-10 text-white peer-checked:hidden"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M5 3v18l15-9L5 3z"></path>
            </svg>
            <svg
              class="w-10 h-10 text-white hidden peer-checked:block"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
            </svg>
          </label>

        </div>
          <Countdown
            className="px-4 text-6xl font-semibold text-midnight-900 dark:text-white"
            paused={paused}
            durationMinutes={25}
          />
      </div>
    </section>
  );
}
