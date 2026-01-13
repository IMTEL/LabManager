import {Equipment} from "@/types/inventory"

export function loanCount(equipment: Equipment): number {
    return equipment.items.filter(unit => unit.activeLoan && unit.activeLoan.status === "Active").length;
}