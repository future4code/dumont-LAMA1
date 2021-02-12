import { UserDatabase } from "../data/UserDataBase";
import { HashGenerator } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";
import { User, UserInputDTO } from "./entities/User";
import { CustomError } from "./error/CustomError";


export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashGenerator: HashGenerator,
        private userDataBase: UserDatabase,
        private authenticator: Authenticator
    ) { }

    async createUser(input: UserInputDTO) {

        try {

            if (!input.email || !input.name || !input.password || !input.role) {
                throw new CustomError(405, "Please, complete email, name, password and role!")
            }

            if (!input.email.includes("@")) {
                throw new CustomError(406, "Invalid email!")
            }

            if (input.password.length < 6) {
                throw new CustomError(422, "Invalid password!")
            }


            const id = this.idGenerator.generate()

            const hashPassword = this.hashGenerator.hash(input.password)

            const user = new User( 
                id,
                input.name,
                input.email,
                hashPassword,
                User.stringToUserRole(input.role)
                )

            await this.userDataBase.createUser(user)

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