import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import  AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    public async execute({ user_id, avatarFilename }: Request): Promise<User> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne(user_id);

        if (!user){ //estou fazendo essa verificação porque um service não deve depender de coisas de fora
            throw new AppError('Only authenticated users can change avatar.', 401); //401 - usuario nõ tem autenticação pra fazer isso
        }

        if (user.avatar) {
            // Deletar avatar anterior

            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath); //deletando caso exista
            }
        }

        user.avatar = avatarFilename;

        await userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
