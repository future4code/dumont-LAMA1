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

        const id = idGenerator.generate()
      
        const hashPassword = await hashGenerator.hash(user.password)

        await userDataBase.createUser(
            id,
            user.email,
            user.name,
            hashPassword,
            user.role
        ) 

        if(!user.email || !user.name || !user.password || !user.role) {
            throw new CustomError(405, "Please, complete email, name, password or role!")
        }

        if(!user.email.includes("@")) {
            throw new CustomError(406, "Please, check your email!")
        }


        const accessToken = authenticator.generateToken({
            id,
            role: user.role
        })

        return accessToken;

    }



}