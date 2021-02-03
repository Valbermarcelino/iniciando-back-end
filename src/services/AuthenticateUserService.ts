import { getRepository } from 'typeorm'; ////já que eu não vou criar um novo método q já não tenha nativamente eu não preciso fazer um repository pra users; só preciso importar isso
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import  AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });

        if (!user) {//user === undefined
            throw new AppError('Incorrect email/passoword combination.', 401);
        }
            // user.passoword - Senha criptografada
            // password - Senha não-criptografada

        const passowordMatched = await compare(password, user.password);

        if (!passowordMatched) {
            throw new AppError('Incorrect email/passoword combination.', 401);
        }

        //se chegou até aqui -> usuário autenticado

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, /*authConfig.jwt.secret*/ secret , {
            subject: user.id,
            expiresIn: expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;

