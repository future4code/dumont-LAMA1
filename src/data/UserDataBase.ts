import { User } from "../business/entities/User";
import { CustomError } from "../business/error/CustomError";
import BaseDataBase from "./BaseDataBase";

export class UserDatabase extends BaseDataBase {

    private static TABLE_NAME = "lama_users";

    private static toUserModel(user: any): User {
        return user && new User(
           user.id,
           user.name,
           user.email,
           user.password,
           User.stringToUserRole(user.role)
        );
     }

    public async createUser(
        user: User

    ): Promise<void> {

        try {

            await BaseDataBase.connection
                .insert({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    password: user.password,
                    role: user.role
                })

                .into(UserDatabase.TABLE_NAME);

        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred to create a new user");
        }
    }

    public async getUserByEmail(email: string): Promise<User> {        

        try {

            const result = await BaseDataBase.connection
                .select("*")
                .from(UserDatabase.TABLE_NAME)
                .where({ email })

              return UserDatabase.toUserModel(result[0])  

        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred with Email");
        }
    }

}