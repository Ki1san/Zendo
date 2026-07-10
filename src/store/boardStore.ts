import { create } from 'zustand'
import type { Board, Task } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { persist } from 'zustand/middleware'
import type { SubTasks } from '../types/index';

interface BoardProps {
  currentBoard: Board | null
  currentTask: Task | null
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

  fetchTaskById: (boardId: string, id: string) => void,
  addTask: (boardId: string, title: string, description?: string, file?: any[], deadline?: string | null, markers?: Task['marker'], subTsk?: any[]) => void
  updateTask: (boardId: string, taskId: string, data: Partial<Task>) => void
  // updateTaskTitle: (boardId: string, taskId: string, newTitle: string) => void
  // updateTaskDescription: (boardId: string, taskId: string, newDescription: string) => void
  // updateTaskDeadLine: (boardId: string, taskId: string, newDeadLine: string | null) => void
  //updateTaskStatus: (boardId: string, taskId: string, newStatus: 'todo' | 'in-progress' | 'complete') => void
  removeTask: (boardId: string, taskId: string) => void
  restoreTask: (boardId: string, taskId: string) => void
  archiveTask: (boardId: string, taskId: string) => void

  addSubTask: (boardId: string, taskId: string, title: string) => void
  updateSubTaskTitle: (boardId: string, taskId: string, sybTaskId: string, newTitle: string) => void
  removeSubTask: (boardId: string, taskId: string, subTaskId: string) => void
  toggleSubTaskChecked: (boardId: string, taskId: string, subTaskId: string) => void,


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
      currentTask: null as Task | null,
      currentBoard: null as Board | null,
      boards: [] as Board[],

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

      fetchTaskById: (boardId: string, id: string) => set((state) => {
        const board = state.boards.find(b => b.id === boardId)
        const task = board ? board.tasks.find(t => t.id === id) : null
        return {currentTask: task || null}
      }),

      updateDate: (boardId) => set((state) => ({
        boards: state.boards.map((board) => 
          board.id === boardId ? { ...board, visitedAt: new Date() } : board
        )
      })),

      addTask: (boardId, title, description="", file=[], deadline: string | null = null, markers: Task['marker'] = '', subTsk = []) => set((state) => {
        const newTask: Task = {
              id: uuidv4(),
              title: title,
              description: description,
              file: file,
              deadline: deadline ? new Date(deadline) : null,
              marker: markers,
              subTsk: subTsk,
              date: new Date(),
              status: 'todo',
              isArhived: false
            } as Task

        return {
          boards: state.boards.map((board) =>  
            board.id === boardId ? { ...board, tasks: [...board.tasks, newTask]} : board
        )}
      }),

      updateTask: (boardId: string, taskId: string, data: Partial<Task>) => set((state) => ({
        boards: state.boards.map( b => b.id === boardId ?
          {...b, tasks: b.tasks.map(t => t.id === taskId ? {...t, ...data} : t)} : b
        ),
        currentTask: state.currentTask?.id === taskId ?
          {...state.currentTask, ...data} : state.currentTask
      })),

      // updateTaskTitle: (boardId, taskId, newTitle) => set((state) => ({
      //   boards: state.boards.map((board) => 
      //     board.id === boardId ? {
      //       ...board, 
      //       tasks: board.tasks.map(task => 
      //         task.id === taskId ? { ...task, title: newTitle } : task
      //       )
      //     } : board
      //   )
      // })),

      // updateTaskDeadLine: (boardId, taskId, newDeadLine) => set((state) =>
      // ({
      //   boards: state.boards.map(b => b.id === boardId 
      //     ? {...b, tasks: b.tasks.map(t => t.id === taskId 
      //       ? {...t, deadline: newDeadLine ? new Date(newDeadLine) : null}
      //       : t
      //     )} 
      //     : b
      //   )
      // })),

      // updateTaskDescription: (boardId, taskId, newDescription) => set((state) => ({
      //   boards: state.boards.map((board) =>
      //     board.id === boardId ? {
      //       ...board, 
      //       tasks: board.tasks.map(task =>
      //         task.id === taskId ? { ...task, description: newDescription } : task
      //       )
      //     } : board
      //   )
      // })),

      // updateTaskStatus: (boardId, taskId, newStatus) => set((state) => ({
      //   boards: state.boards.map((board) =>
      //     board.id === boardId ? {
      //       ...board, 
      //       tasks: board.tasks.map(task =>
      //         task.id === taskId ? { ...task, status: newStatus } : task
      //       )
      //     } : board
      //   )
      // })),

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

      addSubTask: (boardId: string, taskId: string, title: string) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {...board, tasks: 
            board.tasks.map(task =>
              task.id === taskId ? {...task, subTsk: [...task.subTsk || [],
                {
                  id: uuidv4(),
                  title: title,
                  checked: false,
                }
            ]} : task
            )
          } : board
        )
      })),

      updateSubTaskTitle: (boardId: string, taskId: string, sybTaskId: string, newTitle: string) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {...board, tasks: 
            board.tasks.map(task => 
              task.id === taskId ? {...task, subTsk: (task.subTsk || []).map((stsk =>
                stsk.id === sybTaskId ? {...stsk, title: newTitle} : stsk
              ) )} : task
            )
          } : board
        )
      })),

      removeSubTask: (boardId: string, taskId: string, subTaskId: string) => set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? {...board, tasks: 
            board.tasks.map(task => 
              task.id === taskId ? {...task, subTsk: (task.subTsk || []).filter(stsk =>
                stsk.id !== subTaskId
              )} : task
            )
           } : board
        )
      })),

      toggleSubTaskChecked: (boardId: string, taskId: string, subTaskId: string) => set((state) => {
        const board = state.boards.find((b) => b.id === boardId)
        if(!board) return state 

        const task = board.tasks.find((t) => t.id === taskId)
        if(!task || !task.subTsk) return state

        const updateSubTask = task.subTsk.map((st) => 
          st.id === subTaskId ? {...st, checked: !st.checked} : st
        )

        const completeCout = updateSubTask.filter(st => st.checked).length
        const totalCount = updateSubTask.length

        let newStatus = task.status

        if(totalCount > 0)
        {
          if(completeCout === totalCount)
          {
            newStatus ='complete'
          }
          else if (completeCout > 0)
          {
            newStatus = 'in-progress'
          }
          else
          {
            newStatus = 'todo'
          }
        }

        return {
          boards: state.boards.map(b =>
            b.id === boardId ? {...b, tasks: 
              b.tasks.map(t => 
                t.id === taskId ? {...t, subTsk: updateSubTask, status: newStatus} : t
              )
            } : b
          ),
          currentTask: state.currentTask?.id === taskId ? 
            {...state.currentTask, subTsk: updateSubTask, status: newStatus} : state.currentTask
        }

      }),

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
      onCloseTaskModal: () => set({ selectedTask: null, currentTask: null, isTaskModalOpen: false }),

      onOpenCreateTaskModal: (boardId: string) => set({selectedBoardId: boardId, isCreateTaskModalOpen: true }),
      onCloseCreateTaskModal: () => set({ selectedBoardId: null, isCreateTaskModalOpen: false }),

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
