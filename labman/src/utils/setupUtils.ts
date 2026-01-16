import * as fs from "fs"
import {constants} from "fs"

export function fileExistsSync() {
    try {
        fs.accessSync("../../.env", constants.F_OK)
        return true
    } catch {
        return false
    }
}