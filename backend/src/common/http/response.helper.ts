export class ApiResponse {
    static success<T>(message: string, data: T) {
        return {
            success: true, 
            message, 
            data 
        };
    }

    static error(message: string, errors?: string[] | string | null) {
        return {
            success: false,
            errors: errors
                ? Array.isArray(errors)
                    ? errors
                    : [errors]
                : [],
            message,
        };
    }

    static paginated<T>(message: string, data: T[], page: number, limit: number, total: number) {
        return {
            success: true, 
            message, 
            data, 
            meta: { page, limit, total }
        };
    }
}