export interface TokenPayload {
    sub: string;
    username: string;
    role: string;
}

export interface TokenService {
    generateAccessToken(payload: TokenPayload): Promise<string>;
    generateRefreshToken(payload: TokenPayload): Promise<string>;
    verifyAccessToken(token: string): Promise<TokenPayload>;
}
