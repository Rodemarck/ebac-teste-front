export type User = {
    email: string;
    id?: number;
}
export type Task = {
    id?: number;
    title: string;
    description: string;
    deadLine: Date;
    user?: User;
    status?: Status
}


export type Status = 'Pendente' | 'Em andamento' | 'Concluída' | 'DONE' | 'IN_PROGRESS' | 'PENDING';

export interface CardItem {
    id?: number;
    title: string;
    description: string;
    status: Status;
    deadline: Date;
}

export interface TaskCardProps {
    card: CardItem;
    onDoubleClick: () => void;
}

export const getStatus = (status: string): Status => {
    switch (status) {
        case 'Pendente':
            return 'Pendente';
        case 'Em andamento':
            return 'Em andamento';
        default:
            return 'Concluída';
    }
};