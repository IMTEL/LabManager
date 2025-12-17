import {Equipment} from "@/types/inventory"

export function loanCount(equipment: Equipment): number {
    return equipment.items.filter(unit => unit.loanId !== null).length;
}