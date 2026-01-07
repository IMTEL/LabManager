import {Loan} from "@/generated/prisma";

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
        loans: Loan[];
        activeLoanId: number | null;
        activeLoan: Loan | null;

    }[]
}

// TODO: Difference between null and undefined and ? means optional