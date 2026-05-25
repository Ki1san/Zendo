import { create } from 'zustand'
import type { Board } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { persist } from 'zustand/middleware'

interface BoardProps {
  currentBoard: Board | null
  boards: Board[]

  isCreateModalOpen: boolean
  isDeleteModalOpen: boolean
  isEditModalOpen: boolean

  isTaskModalOpen: boolean
  isCreateTaskModalOpen: boolean
  isArchiveTaskModalOpen: boolean
  isDeleteTaskModalOpen: boolean

  editTitle: string
  selectedBoardId: string | null
  selectedTask: string | null
  
  addBoard: (title: string, category?: string, wallperData?: string | null) => void
  removeBoard: (id: string) => void
  fetchBoardById: (id: string) => void
  updateBoard: (id: string, newTitle: string) => void
  updateDate: (boardId: string) => void

  addTask: (boardId: string, title: string, description?: string, file?: []) => void
  updateTaskTitle: (boardId: string, taskId: string, newTitle: string) => void
  updateTaskDescription: (boardId: string, taskId: string, newDescription: string) => void
  updateTaskStatus: (boardId: string, taskId: string, newStatus: 'todo' | 'in-progress' | 'complete') => void
  removeTask: (boardId: string, taskId: string) => void
  restoreTask: (boardId: string, taskId: string) => void
  archiveTask: (boardId: string, taskId: string) => void

  onOpenEditModal: (id: string, currentTitle: string) => void
  onCloseEditModal: () => void

  onOpenHandleModal: () => void
  onCloseHandleModal: () => void
  
  onOpenDeleteModal: (id: string) => void
  onCloseDeleteModal: () => void

  onOpenTaskModal: (id: string) => void
  onCloseTaskModal: () => void

  onOpenCreateTaskModal: (boardId: string) => void
  onCloseCreateTaskModal: () => void

  onOpenArchiveTaskModal: (id: string) => void
  onCloseArchiveTaskModal: () => void

  onOpenDeleteTaskModal: (id: string) => void
  onCloseDeleteTaskModal: () => void

  setTitle: (title: string) => void
}

export const useStoreBoard = create<BoardProps>()(
  persist(
    (set) => ({
      currentBoard: null,
      boards: [],
      isCreateModalOpen: false,
      isDeleteModalOpen: false,
      isEditModalOpen: false,
      
      isTaskModalOpen: false,
      isCreateTaskModalOpen: false,
      isArchiveTaskModalOpen: false,
      isDeleteTaskModalOpen: false,

      editTitle: "",
      selectedBoardId: null,
      selectedTask: null,
      
      addBoard: (title, category, wallperData) => set((state) => ({
        boards: [
          ...state.boards,
          {
            id: uuidv4(),
            title: title,
            category: category,
            wallperData: wallperData,
            date: new Date(),
            visitedAt: new Date(),
            tasks: []
          }
        ]
      })),

      fetchBoardById: (id: string) => set((state) => ({
        currentBoard: state.boards.find((board) => board.id === id) || null
      })),

      updateDate: (boardId) => set((state) => ({
        boards: state.boards.map((board) => 
          board.id === boardId ? { ...board, visitedAt: new Date() } : board
        )
      })),

      addTask: (boardId, title, description="", file=[]) => set((state) => ({
        boards: state.boards.map((board) =>  
          board.id === boardId ? {
            ...board, 
            tasks: [...board.tasks, {
              id: uuidv4(),
              title: title,
              description: description,
              file: file,
              deadline: new Date(),
              marker: [],
              date: new Date(),
              status: 'todo',
              isArhived: false
            }]
          } : board
        )
      })),

      updateTaskTitle: (boardId, taskId, newTitle) => set((state) => ({
        boards: state.boards.map((board) => 
          board.id === boardId ? {
            ...board, 
            tasks: board.tasks.map(task => 
              task.id === taskId ? { ...task, title: newTitle } : task
            )
          } : board
        )
      })),

      updateTaskDescription: (boardId, taskId, newDescription) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {
            ...board, 
            tasks: board.tasks.map(task =>
              task.id === taskId ? { ...task, description: newDescription } : task
            )
          } : board
        )
      })),
        
      updateTaskStatus: (boardId, taskId, newStatus) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {
            ...board, 
            tasks: board.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          } : board
        )
      })),

      removeTask: (boardId, taskId) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {
            ...board, 
            tasks: board.tasks.filter(task => task.id !== taskId)
          } : board
        )
      })),

      restoreTask: (boardId, taskId) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {
            ...board, 
            tasks: board.tasks.map(task => 
              task.id === taskId ? { ...task, isArhived: false } : task
            )
          } : board
        )
      })),

      archiveTask: (boardId, taskId) => set((state) => ({
        boards: state.boards.map((board) => 
          board.id === boardId ? {
            ...board, 
            tasks: board.tasks.map(task =>
              task.id === taskId ? { ...task, isArhived: true } : task
            )
          } : board
        )
      })),

      removeBoard: (id) => set((state) => ({
        boards: state.boards.filter((b) => b.id !== id),
        currentBoard: state.currentBoard?.id === id ? null : state.currentBoard
      })),

      updateBoard: (id, newTitle) => set((state) => {
        const updatedBoards = state.boards.map((b) => 
          b.id === id ? { ...b, title: newTitle } : b
        )
        
        const updatedCurrentBoard = state.currentBoard?.id === id 
          ? updatedBoards.find((b) => b.id === id) || null 
          : state.currentBoard

        return {
          boards: updatedBoards,
          currentBoard: updatedCurrentBoard
        }
      }),

      onOpenHandleModal: () => set({ isCreateModalOpen: true }),
      onCloseHandleModal: () => set({ isCreateModalOpen: false }),
      
      onOpenDeleteModal: (id) => set({
        isDeleteModalOpen: true,
        selectedBoardId: id,
      }),
      onCloseDeleteModal: () => set({
        isDeleteModalOpen: false,
        selectedBoardId: null
      }),

      onOpenEditModal: (id, currentTitle) => set({
        isEditModalOpen: true,
        selectedBoardId: id,
        editTitle: currentTitle,
      }),

      onCloseEditModal: () => set({
        isEditModalOpen: false,
        selectedBoardId: null,
        editTitle: '',
      }),

      onOpenTaskModal: (id: string) => set({ selectedTask: id, isTaskModalOpen: true }),
      onCloseTaskModal: () => set({ selectedTask: null, isTaskModalOpen: false }),

      onOpenCreateTaskModal: (boardId: string) => set({selectedBoardId: boardId, isCreateTaskModalOpen: true }),
      onCloseCreateTaskModal: () => set({ selectedTask: null, isCreateTaskModalOpen: false }),

      onOpenArchiveTaskModal: (id: string) => set({ selectedTask: id, isArchiveTaskModalOpen: true }),
      onCloseArchiveTaskModal: () => set({ selectedTask: null, isArchiveTaskModalOpen: false }),

      onOpenDeleteTaskModal: (id: string) => set({ selectedTask: id, isDeleteTaskModalOpen: true }),
      onCloseDeleteTaskModal: () => set({ selectedTask: null, isDeleteTaskModalOpen: false }),

      setTitle: (title) => set({ editTitle: title })
    }),
    {
      name: 'boards-tasks',
    }
  )
)
