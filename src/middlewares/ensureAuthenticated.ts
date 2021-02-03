import {Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';

import  AppError from '../errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
    // Validação do token JWT

    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
    }

    //formato 'Bearer fwqoifjiqf(esse é o token)'

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        //console.log(decoded);
        const { sub } = decoded as TokenPayload; //forcei o formato TokenPayload proo decoded

         request.user = {
             id: sub,
         }

        return next();
    } catch {
        throw new AppError('Invalid JWT token', 401);
    }
}
