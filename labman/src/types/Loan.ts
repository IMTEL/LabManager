export type LoanActions = {
    deleteLoan: (id: number) => void;
    returnLoan: (id: number) => void;
}

type Borrower = {
    id: number;
    name: string;
    phone?: string | null;
    email?: string | null
    note?: string | null
    creationDate: Date;
}

type Item = {
    id: number;
    equipment: {
        id: number;
        name: string;
        categoryId: number;
        image: string | null;
        createdAt: Date;

    }
}

export class LoanClass {
    constructor(
        public id: number,
        public status: string,
        public startDate: Date,
        public endDate: Date,
        public borrower : Borrower,
        public item : Item,
        private actions: LoanActions
    ) {}

    return() {
        this.actions.returnLoan(this.id);
    }

    delete() {
        this.actions.deleteLoan(this.id);
    }
}