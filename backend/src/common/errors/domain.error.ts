import { DomainErrorCode } from '../http/domain-error-status-code.mapper';

export class DomainError extends Error {
    constructor(
        public readonly code: DomainErrorCode,
        message: string,
    ) {
        super(message);
        this.code = code;
    }
}