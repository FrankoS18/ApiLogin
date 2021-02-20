import {Request, Response, NextFunction} from 'express';
import { getRepository } from 'typeorm';
import {User} from '../entity/User'

export const checkRole = (roles:Array<string>)=>{

    return async (req: Request, res:Response, next: NextFunction)=>{
        const {userId} = res.locals.jwtPlayload;
        const userRepository = getRepository(User);

        let user: User;
        try{
            user = await userRepository.findOneOrFail(userId);
        }
        catch(error){
            return res.status(401).send();

        }
        // Verificamos (check)

        const {role} = user;
        if(roles.includes(role)){
            next();
        }else{
            res.status(401).json({message: 'Su usuario no posee la jerarquia necesaria'});
        }

    };

};