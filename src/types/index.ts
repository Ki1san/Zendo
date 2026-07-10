export interface Board 
{
    id: string,
    title: string,
    date: Date,
    category?: string, 
    wallperData?: string | null, 
    tasks: Task[],
    visitedAt?: Date,
}

export interface Task
{
    id: string,
    title: string,
    description?: string,
    date?: Date,
    marker: '' |'important' | 'less important' | 'does not matter' | 'in-addition',
    file: any[],
    deadline: Date | null,
    subTsk?: SubTasks[],
    status: 'todo' | 'in-progress' | 'complete',
    isArhived: boolean
}

export interface SubTasks
{
    id: string,
    title?: string,
    checked: boolean
}

export interface ConfirmModalProps
{
    open: boolean
    onClose: () => void
    onConfirm: () => void
    message: string
    taskId: string | null
    boarId: string | null
    color?: 'error' | 'primary' 
}