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
    title?: string,
    description?: string,
    date?: Date,
    status: 'todo' | 'in-progress' | 'complete',
}