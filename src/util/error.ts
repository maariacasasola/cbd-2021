
export class AppError {
    constructor(public status: number, public code: string, public message: string) {
    }
}