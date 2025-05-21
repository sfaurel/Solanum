import { create } from 'zustand'

type Board = {
  id: string
  name: string
}

type BoardsStore = {
  boards: Board[]
  selectedBoardId: string | null
  fetchBoards: () => Promise<void>
  selectBoard: (id: string) => void
}

export const useBoardsStore = create<BoardsStore>((set) => ({
  boards: [],
  selectedBoardId: null,
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
    // localStorage.setItem('selected_project_id', id ?? "")
    set({ selectedBoardId: id })
  }
}))