import { ApplicationErrorCode } from '../../domain/application-error-code.enum';

export const APPLICATION_ERROR_HTTP_STATUS: Record<ApplicationErrorCode, number> = {
    [ApplicationErrorCode.APPLICATIONS_ARRAY_EMPTY]: 400,
    [ApplicationErrorCode.APPLICATION_DETAIL_NOT_FOUND]: 404,
};
