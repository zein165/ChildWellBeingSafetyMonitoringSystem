import {UserErrorCode} from "../../domain/user-error-code.enum";

export const USER_ERROR_HTTP_STATUS: Record<UserErrorCode, number> = {
    [UserErrorCode.INVALID_USERNAME]: 400,
    [UserErrorCode.INVALID_ROLE]: 400,
    [UserErrorCode.INVALID_CHILD]: 400,
    [UserErrorCode.INVALID_PARENT]: 400,
    [UserErrorCode.UNAUTHORIZED]: 401,
    [UserErrorCode.INVALID_CREDENTIALS]: 401,
    [UserErrorCode.USERNAME_ALREADY_TAKEN]: 409,
};