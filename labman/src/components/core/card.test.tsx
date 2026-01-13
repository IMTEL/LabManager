import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

type Loan = {
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;

    borrower: {
        id: number;
        name: string;
        phone?: string | null;
        email?: string | null
        note?: string | null
        creationDate: Date;

    }
    item: {
        id: number;
        equipment: {
            id: number;
            name: string;
            categoryId: number;
            image: string;
            createdAt: Date;

        }
    };
}

const loan : Loan = {
    id: 1,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-19"),
    status: "Active",
    borrower: {
        id: 1,
        name: "ola",
        phone: "95387901",
        email: "fkdsfd@g.com",
        note: "",
        creationDate: new Date(),
    },
    item: {
        id: 1,
        equipment: {
            id: 1,
            name: "test",
            categoryId: 1,
            image: "",
            createdAt: new Date(),
        }
    }


}

// TODO: JS only supports YYYY-MM-DD natively, so we need to parse Norwegian date format
function parseNorwegianDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
}

test('Loan card correctly updates based on date', () => {

    render(<Card loan={loan} />)
    const currentDate = new Date();
    const child = screen.getByText('Borrower:')
    const parentDiv = child.parentElement;
    const returnDate = parentDiv?.children[5].textContent;

    const loanStatus = screen.getByText(/Active|Due/)

    if (returnDate && parseNorwegianDate(returnDate) < currentDate) {
        expect(loanStatus.textContent).toBe("Due")
    } else if (returnDate && parseNorwegianDate(returnDate) >= currentDate) {
        expect(loanStatus.textContent).toBe("Active")
    }
})