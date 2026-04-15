"use server"

type ActionResult<T> = | { type: "success"; data: T} | { type: "confirm"; message: string} | { type: "error"; message: string}

// Used to delay the execution of an action for testing purposes
function delay(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

