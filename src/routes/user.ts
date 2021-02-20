import {UserController} from './../controller/UserController'
import {Router} from 'express'
import {checkJwt} from '../middlewares/jwt'
import {checkRole} from '../middlewares/role'

const router = Router();

//Obtiene todos los usuario
router.get('/', [checkJwt],UserController.getAll);
//Busca por id
router.get('/:id', [checkJwt],UserController.getById);
//Crear un  nuevo usuario
router.post('/', [checkJwt, checkRole(['estandar'])],UserController.newUser);
//Modificar Usuario
router.put('/:id', [checkJwt],UserController.editUser);
//Borrar usuario
router.delete('/:id', [checkJwt],UserController.deleteUser);

export default router;
