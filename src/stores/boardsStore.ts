import { create } from 'zustand'

type Task = {
  id: string;
  properties?: {
    Name?: {
      title: { plain_text: string }[];
    };
  };
};

type Board = {
  id: string
  name: string
}

type BoardsStore = {
  boards: Board[]
  selectedBoardId: string | null
  selectedTask: Task | null;
  fetchBoards: () => Promise<void>
  selectBoard: (id: string) => void
  selectTask: (task: Task) => void;
}

export const useBoardsStore = create<BoardsStore>((set) => ({
  boards: [],
  selectedBoardId: null,
  selectedTask: null,
  fetchBoards: async () => {
    const boardsResponse = await fetch('/api/boards', {
      credentials: 'include'
    });

    const boards = (await boardsResponse.json()).map(board => ({
      id: board.id,
      name: board.title?.[0]?.text?.content || "Untitled"
    }));
    set({ boards: boards })
  },
  selectBoard: (id) => {
    set({ selectedBoardId: id })
  },
  selectTask: (task) => {
    set({ selectedTask: task });
  },
}))