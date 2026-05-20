export interface Board 
{
    id: string,
    title: string,
    date?: string | Date,
    category?: string, 
    wallperData?: string | null, 
    countTask: number | null,
}