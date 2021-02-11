import { Request, Response } from "express";
import { UserInputDTO } from "../business/entities/User";
import { UserBusiness } from "../business/UserBusiness";

const userBusiness = new UserBusiness()

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

}