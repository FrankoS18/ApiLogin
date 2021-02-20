import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn} from "typeorm";
import {MinLength, IsNotEmpty} from 'class-validator'
import * as bcrypt from 'bcryptjs'


//TODO: agregar IsEmail

@Entity()
@Unique(['username'])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(6)
    username: string;

    @Column()
    @MinLength(6)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    registrado: Date;

    @Column()
    @UpdateDateColumn()
    modificado: Date;


    // Se encripta la clave del usuario
    hashPasword():void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    //Se compara la clave encriptada
    checkPassword(password:string):boolean{
        return bcrypt.compareSync(password, this.password);
    }

}
