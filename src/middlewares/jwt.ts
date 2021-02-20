import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const checkJwt = (req:Request, res:Response, next:NextFunction) =>{
    const token = <string>req.headers['auth'];
    let jwtPlayload;

    try {
        jwtPlayload = <any>jwt.verify(token, config.jwtSecret)
        res.locals.jwtPlayload = jwtPlayload;
    } catch (error) {
        return res.status(401).json({message: 'No autorizado'});
    }

    const {userId, username} = jwtPlayload;
    const newToken = jwt.sign({userId, username}, config.jwtSecret, {expiresIn: '1h'});
    res.setHeader('token', newToken);
    next();

}