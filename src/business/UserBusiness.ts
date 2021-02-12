import { UserDatabase } from "../data/UserDataBase";
import { HashGenerator } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";
import { User, UserInputDTO, UserLoginInputDTO } from "./entities/User";
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

            if (!input.email || !input.name || !input.password) {
                throw new CustomError(405, "Please, complete email, name and password!")
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

    async loginUser(input: UserLoginInputDTO) {

        try {

            if (!input.email || !input.password) {
                throw new CustomError(405, "Please, complete email and password!")
            }

            if (!input.email.includes("@")) {
                throw new CustomError(406, "Invalid email!")
            }

            if (input.password.length < 6) {
                throw new CustomError(422, "Invalid password!")
            }

            const userFromDB = await this.userDataBase.getUserByEmail(input.email)

            const passwordIsCorrect = this.hashGenerator.compareHash(input.password, userFromDB.password)

            const accessToken = this.authenticator.generateToken({
                id: userFromDB.id,
                role: userFromDB.role
            });

            if (!passwordIsCorrect) {
                throw new CustomError(401, "Invalid credentials!");
            }

            return accessToken;


        } catch (error) {
            throw new CustomError(error.statusCode || 400, error.message)
        }

    }
}