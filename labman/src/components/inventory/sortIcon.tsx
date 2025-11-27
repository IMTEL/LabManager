export default function SortIcon({ direction }: { direction: string | null}) {

    if (direction === "asc") {
        return (
            <svg width="30" height="30" viewBox="0 0 24 24" className="ml-2">
                <path d="M12 5L8 9H16L12 5Z" fill="currentColor" />
            </svg>
        );
    }
    if (direction === "desc") {
        return (
            <svg width="30" height="30" viewBox="0 0 24 24" className="ml-2">
                <path d="M12 19L16 15H8L12 19Z" fill="currentColor" />
            </svg>
        );
    }
    // No sorting
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" className="opacity-40 ml-2">
            <path d="M12 5L8 9H16L12 5Z" fill="currentColor" />
            <path d="M12 19L16 15H8L12 19Z" fill="currentColor" />
        </svg>
    );
}