import { User } from "../business/entities/User";
import { CustomError } from "../business/error/CustomError";
import BaseDataBase from "./BaseDataBase";

export class UserDatabase extends BaseDataBase {

    private static TABLE_NAME = "lama_users";
    

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
            throw new CustomError(500, "An unexpected error ocurred");
        }
    }

}