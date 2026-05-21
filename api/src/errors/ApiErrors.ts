
export default class ApiErrors extends Error {
    
    statusCode: number

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}