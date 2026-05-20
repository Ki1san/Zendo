import { useState } from 'react';
import type {Board} from '../types/index'
import { ThemeProvider } from '@emotion/react';
import { Box, Modal } from '@mui/material';
import { theme } from '../theme/Palette';

const Board: React.FC = () =>
{
    const [newBoard, setNewBoard] = useState<Board[]>([])
    const [title, setTitle] = useState(`Доска ${newBoard.length + 1}`)
    const [editId, setEditId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")

    const createBoard = () =>
    {
        if (!title.trim()) return

        const board: Board =
        {
            id: crypto.randomUUID(),
            title: title ,
            countTask: 0,
        }   
        setNewBoard([...newBoard, board])
        setTitle('')
    }

    const removeBoard = (id: string) =>
    {
        setNewBoard((prev) => prev.filter(board => board.id !== id))
    }
    
    const startEnditing = (board: Board) =>
    {
        setEditId(board.id)
        setEditTitle(board.title)
    }

    const updateBoard = (id: string) =>
    {   
        setNewBoard((prev) => prev.map( board =>
            board.id === id ?  {...board, title: editTitle} : board
        ))
        setEditId(null)
    }

    const handleCanselEdit = () =>
    {
        setEditId(null)
        setEditId("")
    }

    return(
        <></>
    )
}

export default Board