import {create} from 'zustand'
import type { Board } from '../types'

interface BoardProps 
{
    boards: Board[],
    isCreateModalOpen: boolean,
    isDeleteModalOpen: boolean,
    isEditModalOpen: boolean

    editTitle: string
    selectedBoardId: string | null

    addBoard: (title: string) => void,
    removeBoard: (id: string) => void,
    updateBoard: (id: string, newTitle: string) => void,

    onOpenEditMoadal: (id: string, currentTitle: string) => void
    onCloseEditModal: () => void

    onOpenHandleModal: () => void,
    onCloseHandleModal: () => void,

    onOpenDeleteModal: (id: string) => void,
    onCloseDeleteModal: () => void,

    setTitle: (title: string) => void
}

export const useStoreBoard = create<BoardProps>((set) => ({
    boards: [],
    isCreateModalOpen: false,
    isDeleteModalOpen: false,
    isEditModalOpen: false,

    editTitle: "",
    selectedBoardId: null,

    addBoard: (title: string) => set((state) => 
    ({
        boards: 
        [
            ...state.boards, 
            {
                id: crypto.randomUUID(),
                title: title,
                date: new Date(), 
                countTask: 0
            }
        ]
    })),

    removeBoard: (id: string) => set((state) => ({
        boards: state.boards.filter((b) => b.id !== id)
    })),

    updateBoard: (id: string, newTitle: string) => set((state) => ({
        boards: state.boards.map((b) => b.id === id ? {...b, title: newTitle} : b)
    })),

    onOpenHandleModal: () => set({isCreateModalOpen: true}),
    onCloseHandleModal: () => set({isCreateModalOpen: false}),

    onOpenDeleteModal: (id: string) => set(
        {
            isDeleteModalOpen: true,
            selectedBoardId: id,
        }),

    onCloseDeleteModal: () => set(
        {
            isDeleteModalOpen: false,
            selectedBoardId: null
        }),

    onOpenEditMoadal: (id: string, currentTitle: string) => set({
        isEditModalOpen: true,
        selectedBoardId: id,
        editTitle: currentTitle,
    }),

    onCloseEditModal: () => set({
        isEditModalOpen: false, 
        selectedBoardId: null,
        editTitle: '',
    }),

    setTitle: (title: string) => set({editTitle: title})
}))