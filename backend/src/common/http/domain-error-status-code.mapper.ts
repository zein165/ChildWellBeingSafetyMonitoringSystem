import {USER_ERROR_HTTP_STATUS} from "../../auth/infrastructure/http/error-status-code.mapper";

export type DomainErrorCode = keyof typeof USER_ERROR_HTTP_STATUS;

export const DOMAIN_ERROR_STATUS_CODE: Record<DomainErrorCode, number> = {
    ...USER_ERROR_HTTP_STATUS
}