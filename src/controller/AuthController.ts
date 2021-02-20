import {getRepository} from 'typeorm'
import {Request, Response} from 'express'
import {User} from '../entity/User';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { validate } from 'class-validator';


class AuthController{
    static login = async(req:Request, res:Response) => {

        // Se rescatan las variables del front
        const {username, password} = req.body;

        // Se valida que las variables existan y no esten vacias
        if(!(username && password)){
          return res.status(400).json({message: 'Nombre de usuario y clave son requeridos!'});
        }

        // Se crea variable para acceder a DB
        const userRepository = getRepository(User);
        let user: User;

        try {
            // Se busca en base de datos mediante variable 
            //creada previamente (userRepository) por usuario y nombre
            user = await userRepository.findOneOrFail({where:{username}});
        } catch (error) {
            // En caso de error se devuleve estado 400
            return res.status(400).json({message: 'Usuario o Clave son incorrectos!'});
        }

        // se valida contraseña
        if(!user.checkPassword(password)){
            return res.status(400).json({message: 'acceso denegado'});
        }

        const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '1h'})

        // Si se encontro registro se devuelve como respuesta
        res.json({message: 'Ok', token});
    };

    static cambiarPass = async(req:Request, res:Response)=>{
        const {userId} = res.locals.jwtPlayload;
        const {oldPass, newPass} = req.body;

        if(!(oldPass && newPass)){
            res.status(400).json({message: 'La clave antigua y la nueva son requeridas'});
        }else{
            const userRepository = getRepository(User);
            let user:User;

            try {
                user = await userRepository.findOneOrFail(userId);
            } catch (error) {
                res.status(400).json({message: 'Fallo en recuperacion de datos, compruebe que sus datos ingresados sean correctos'});
            }

            if(!user.checkPassword(oldPass)){
                return res.status(401).json({message: 'Error, Verifique su pass antiguo'});
            }

            user.password = newPass;
            const validationOps = {validationError:{target:false, value:false}};
            const errors = await validate(user, validationOps);
            
            if(errors.length > 0){
                return res.status(400).json(errors);
            }

            // Hash pass

            user.hashPasword();
            userRepository.save(user);

            res.json({message: 'Clave actualizada!'});
        }
    };

}

export default AuthController;