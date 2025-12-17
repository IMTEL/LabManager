export type Equipment = {
    id: number;
    name: string;
    image: string;
    category: {
        id: number;
        name: string;
    }
    createdAt: Date;
    items: {
        id: number;
        equipmentId: number;
        status: string;
        createdAt: Date;
        notes: string[];
        errors: string[];
        loanId: number | null;

    }[]
}