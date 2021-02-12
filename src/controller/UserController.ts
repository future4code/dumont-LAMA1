import { Request, Response } from "express";
import { UserInputDTO, UserLoginInputDTO } from "../business/entities/User";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../data/UserDataBase";
import { HashGenerator } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";

const userBusiness = new UserBusiness(
    new IdGenerator(),
    new HashGenerator(),
    new UserDatabase(),
    new Authenticator()
)

export class UserController {

    async signup(req: Request, res: Response) {

        try {

            const input: UserInputDTO = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: req.body.role
            }

            const token = await userBusiness.createUser(input);

            res.status(201).send({ token });

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message });
        }

    }

    async login(req: Request, res: Response) {

        try {

            const input: UserLoginInputDTO = {
                email: req.body.email,             
                password: req.body.password               
            }

            const token = await userBusiness.loginUser(input);

            res.status(201).send({ token });

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message });
        }

    }

}

