import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {DomainError} from "../errors/domain.error";
import {ApiResponse} from "../http/response.helper";
import {DOMAIN_ERROR_STATUS_CODE} from "../http/domain-error-status-code.mapper";

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status = DOMAIN_ERROR_STATUS_CODE[exception.code] ?? 400;

        response.status(status).json(ApiResponse.error(exception.message))
    }
}