import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '../http/response.helper';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unexpected error occurred';
        let errors: any = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const res = exception.getResponse();

            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                const r = res as any;
                message = r.message ?? message;
                errors = r.errors;
            }
        } else {
            console.error('UNEXPECTED ERROR:', exception);
            message = 'Unexpected error occurred';
        }

        response.status(status).json(ApiResponse.error(message, errors));
    }
}