import {USER_ERROR_HTTP_STATUS} from "../../auth/infrastructure/http/error-status-code.mapper";
import {
    APPLICATION_ERROR_HTTP_STATUS
} from '../../application-inventory/infrastructure/http/error-status-code.mapper';

export type DomainErrorCode =
    keyof typeof USER_ERROR_HTTP_STATUS |
    keyof typeof APPLICATION_ERROR_HTTP_STATUS;

export const DOMAIN_ERROR_STATUS_CODE: Record<DomainErrorCode, number> = {
    ...USER_ERROR_HTTP_STATUS,
    ...APPLICATION_ERROR_HTTP_STATUS
}