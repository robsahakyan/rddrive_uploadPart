import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';

export function getToken({ req, res }: {req: NextApiRequest, res: NextApiResponse}): null | string | boolean {
    let token = getCookie('token', { req, res });
    if (token) {
        return token;
    }
    return null
}

export function setToken(token: string): void {
    if (typeof window !== "undefined") {
        setCookie('token', token, {
            maxAge: 3600
        });
    }
}

export function clearToken(): void {
    if (typeof window !== "undefined") {
        deleteCookie('token');
    }
}