import { UserDatabase } from "../data/UserDataBase";
import { HashGenerator } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";
import { UserInputDTO } from "./entities/User";
import { CustomError } from "./error/CustomError";


export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashGenerator: HashGenerator,
        private userDataBase: UserDatabase,
        private authenticator: Authenticator
    ) { }

    async createUser(user: UserInputDTO) {

        try {

            if (!user.email || !user.name || !user.password || !user.role) {
                throw new CustomError(405, "Please, complete email, name, password and role!")
            }

            if (!user.email.includes("@")) {
                throw new CustomError(406, "Invalid email!")
            }

            if (user.password.length < 6) {
                throw new CustomError(422, "Invalid password!")
            }


            const id = this.idGenerator.generate()

            const hashPassword = this.hashGenerator.hash(user.password)

            await this.userDataBase.createUser(
                id,
                hashPassword,
                user.name,
                user.email,
                user.role
            )

            const accessToken = this.authenticator.generateToken({
                id,
                role: user.role
            })

            return accessToken;

        } catch (error) {
            throw new CustomError(error.statusCode || 400, error.message)
        }

    }
}