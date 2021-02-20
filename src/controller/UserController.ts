import {getRepository, Repository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from 'class-validator'


export class UserController {

    static getAll= async(req:Request, res:Response) => {
        const userRepository = getRepository(User);
        try {
            const users = await userRepository.find();

            if(users.length > 0){
                res.send(users);
            }else{
               return res.status(404).json({message: 'Sin Resultados'});
            }
        } catch (error) {
           return res.status(404).json({message: 'Error al buscar todos los registros'});
        }
        
    };

    static getById= async(req:Request, res:Response) => {
       const {id} = req.params;
       const userRepository = getRepository(User);
       try {
           const user = await userRepository.findOneOrFail(id);
            if(user !== null){
                res.send(user);
            }
            else{
                return res.status(404).json({message: 'No se encontro registro asociado'});
            }
           
       } catch (error) {
        return res.status(404).json({message: 'Error al buscar por id'});
       }
    };

    static newUser = async (req:Request, res:Response) => {
        const {username, password, role} = req.body;
        const user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        // Validaciones
        const errors = await validate(user, {validationError:{target:false, value:false}});

        if(errors.length > 0){
            return res.status(400).json(errors);
        }
        // TODO: HASH PASSWORD

        const userRepository = getRepository(User);
        try {
            user.hashPasword();
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({message: 'El nombre de usuario ya existe'});
        }

        res.status(201).json({message: 'Usuario creado'});

    };

    static editUser = async (req:Request, res:Response) => {
        let user;
        const {id} = req.params;
        const {username, role} = req.body;

        const userRepository = getRepository(User);
        try {
            user = await userRepository.findOneOrFail(id);

        } catch (error) {
            return res.status(404).json({message: 'No se encontro usuario'});
        }

        user.username = username;
        user.role = role;

        const errors = await validate(user, {validationError:{target:false, value:false}});
        if(errors.length > 0){
            return res.status(400).json(errors);
        }

        // intenta guardar
        try {
            await userRepository.save(user);
        } catch (error) {
            return res.status(409).json({message: 'Error al intentar guardar datos'});
        }
        
        res.status(201).json({message: 'usuario editado con exito'});

    };

    static deleteUser = async (req:Request, res:Response) => {
        const {id} = req.params;
        const userRepository = getRepository(User);

        let user:User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }

        userRepository.delete(id);
        res.status(201).json({message: 'Usuario eliminado'});

    };


}

export default UserController;