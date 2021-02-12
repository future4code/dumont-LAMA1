import { UserDatabase } from "../data/UserDataBase";
import { HashGenerator } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";
import { UserInputDTO } from "./entities/User";
import { CustomError } from "./error/CustomError";

const idGenerator = new IdGenerator()
const hashGenerator = new HashGenerator()
const userDataBase = new UserDatabase()
const authenticator = new Authenticator()


export class UserBusiness {

    async createUser(user: UserInputDTO) {

        if(!user.email || !user.name || !user.password || !user.role) {
            throw new CustomError(405, "Please, complete email, name, password and role!")
        }

        if(!user.email.includes("@")) {
            throw new CustomError(406, "Invalid email!")
        }

        if(user.password.length < 6) {
            throw new CustomError(422, "Invalid password!")
        }


        const id = idGenerator.generate()
      
        const hashPassword = hashGenerator.hash(user.password)

        await userDataBase.createUser(
            id,
            hashPassword,
            user.name,
            user.email,
            user.role
        ) 

        const accessToken = authenticator.generateToken({
            id,
            role: user.role
        })

        return accessToken;

    }

}