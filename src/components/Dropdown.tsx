import React, { useState, useEffect } from "react";

export interface Option {
  id: string;
  name: string;
  color?: string;
  group?: string;
}

export interface Group {
  id: string;
  name: string;
  color?: string;
  options: Option[];
}

export interface Schema {
  type: string;
  options?: Option[];
  groups?: Group[];
}

export interface Props {
  schema: Schema;
  selected?: string;
  placeholder?: string;
}

export const styleClasses = {
  yellow: {
    pill: {
      bg: "rounded-full bg-yellow-100 dark:bg-yellow-600",
      dot: "bg-yellow-300 dark:bg-yellow-700",
    },
    badge: {
      bg: "rounded-md bg-yellow-100 dark:bg-yellow-900",
    },
  },
  gray: {
    pill: {
      bg: "rounded-full bg-gray-500 dark:bg-gray-500",
      dot: "bg-gray-300 dark:bg-gray-300",
    },
    badge: {
      bg: "rounded-md bg-gray-100 dark:bg-gray-900",
    },
  },
  blue: {
    pill: {
      bg: "rounded-full bg-blue-100 dark:bg-blue-900",
      dot: "bg-blue-300 dark:bg-blue-600",
    },
    badge: {
      bg: "rounded-md bg-blue-100 dark:bg-blue-900",
    },
  },
  pink: {
    pill: {
      bg: "rounded-full bg-pink-100 dark:bg-pink-900",
      dot: "bg-pink-300 dark:bg-pink-600",
    },
    badge: {
      bg: "rounded-md bg-pink-100 dark:bg-pink-900",
    },
  },
  purple: {
    pill: {
      bg: "rounded-full bg-purple-100 dark:bg-purple-900",
      dot: "bg-purple-300 dark:bg-purple-600",
    },
    badge: {
      bg: "rounded-md bg-purple-100 dark:bg-purple-900",
    },
  },
  green: {
    pill: {
      bg: "rounded-full bg-green-100 dark:bg-green-900",
      dot: "bg-green-300 dark:bg-green-600",
    },
    badge: {
      bg: "rounded-md bg-green-100 dark:bg-green-900",
    },
  },
  brown: {
    pill: {
      bg: "rounded-full bg-amber-200 dark:bg-amber-800",
      dot: "bg-amber-400 dark:bg-amber-600",
    },
    badge: {
      bg: "rounded-md bg-amber-200 dark:bg-amber-800",
    },
  },
};

const normalizeColor = (color: string): keyof typeof styleClasses => {
  return color === "default" ? "gray" : (color as keyof typeof styleClasses);
};

export const Dropdown: React.FC<Props> = ({
  schema,
  selected = "",
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const isGrouped = schema.groups && schema.groups.length > 0;
  const options: Option[] = isGrouped
    ? schema.groups!.flatMap((group) =>
        group.options.map((opt) => ({
          ...opt,
          group: group.name,
        }))
      )
    : schema.options || [];

  const groups = isGrouped
    ? [...new Set(schema.groups?.map((g) => g.name))]
    : [];

  const handleSelect = (opt: Option) => {
    setSelectedOption(opt);
    setOpen(false);
  };

  const renderOption = (opt: Option) => {
    const colorStyle= styleClasses[opt.color] || styleClasses["gray"];
    const style = colorStyle[schema.type === "status" ? "pill" : schema.type === "select" ? 'badge' : null] || '';

    return (
      <button
        key={opt.id}
        onClick={() => handleSelect(opt)}
        className="flex items-center w-full px-2.5 text-left hover:bg-midnight-300 hover:dark:bg-midnight-700"
      >
        <div className={`flex items-center px-2 py-0.5 gap-1.5 text-white ${style.bg}`}>
          {schema.type === "status" && (
            <div className={`w-2 h-2 rounded-full ${colorStyle.pill.dot}`} />
          )}
          <span className="text-white">{opt.name}</span>
        </div>
      </button>
    );
  };

  const renderSelected = () => {
    if (!selectedOption) return placeholder;

    const colorStyle= styleClasses[selectedOption.color] || styleClasses["gray"];
    const style = colorStyle[schema.type === "status" ? "pill" : schema.type === "select" ? 'badge' : null] || '';

    return (
      <div className={`flex items-center px-2 py-0.5 gap-1.5 ${style.bg}`}>
        {schema.type === "status" && (
          <div className={`w-2 h-2 rounded-full ${colorStyle.pill.dot}`} />
        )}
        <span className="text-black dark:text-white">{selectedOption.name}</span>
      </div>
    );
  };

  return (
    <div className="statusDropdown relative w-full text-sm font-medium">
      <button
        onClick={() => setOpen(!open)}
        className="dropdownToggle flex justify-between items-center w-full rounded-t-md rounded-b-md border bg-midnight-300 border-midnight-400 dark:bg-midnight-700 dark:border-midnight-600 px-3 py-2 cursor-pointer"
      >
        {renderSelected()}
        <svg
          className="w-4 h-4 text-midnight-600 dark:text-midnight-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="dropdownMenu absolute z-10 w-full rounded-b-md border border-t-0 border-midnight-400 bg-midnight-200 dark:border-midnight-600 dark:bg-midnight-800 shadow-lg overflow-hidden">
          {isGrouped
            ? groups.map((group) => (
                <div key={group}>
                  <div className="px-3 py-2 text-xs text-midnight-700 dark:text-midnight-300 uppercase tracking-wide border-t border-midnight-400 dark:border-midnight-600">
                    {group}
                  </div>
                  {options
                    .filter((opt) => opt.group === group)
                    .map((opt) => renderOption(opt))}
                </div>
              ))
            : options.map((opt) => renderOption(opt))}
        </div>
      )}
    </div>
  );
};
