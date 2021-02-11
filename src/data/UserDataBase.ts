import { CustomError } from "../business/error/CustomError";
import BaseDataBase from "./BaseDataBase";

export class UserDatabase extends BaseDataBase {

    private static TABLE_NAME = "lama_users";


    public async createUser(
        id: string,
        email: string,
        name: string,
        password: string,
        role: string
    ): Promise<void> {

        try {

            await BaseDataBase.connection
                .insert({
                    id,
                    email,
                    name,
                    password,
                    role
                })
                .into(UserDatabase.TABLE_NAME);

        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred");
        }
    }

}