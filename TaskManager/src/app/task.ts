export interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    image_name: string;
}

export interface ApiResponse {
    data: Task[];
}