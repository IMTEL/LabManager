import {Loan} from "@/generated/prisma";

export type Equipment = {
    id: number;
    name: string;
    image: string | null;
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

export type EquipmentWithCategoryAndItems = {
    id: number;
    name: string;
    image: string | null;
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
        activeLoanId: number | null;

    }[]
}

export type Unit = {
    id: number;
    equipmentId: number;
    status: string;
    createdAt: Date;
    notes: string[];
    errors: string[];
};

// TODO: Difference between null and undefined and ? means optional