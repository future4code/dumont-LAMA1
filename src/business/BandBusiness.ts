import { BandDataBase } from "../data/BandDataBase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";
import { Band, BandInputDTO } from "./entities/Band";
import { AuthenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class BandBusiness {

    constructor (
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private bandDatabase: BandDataBase
    ) { }

    public async createBand(
        token: string,
        input: BandInputDTO
    ) {
        try {
            const { name, musicGenre, responsible } = input
            const tokenData: AuthenticationData = this.authenticator.getData(token);

            if (tokenData.role !== "ADMIN") {
                throw new CustomError(401, "Only ADMIN users can register bands")
            }

            if (!name || !musicGenre || !responsible) {
                throw new CustomError(
                    422, 
                    "Please inform 'name', 'musicGenre' and 'responsible' to register a band"
                )
            }

            const id: string = this.idGenerator.generate()

            await this.bandDatabase.createBand(
                new Band(
                    id,
                    name,
                    musicGenre,
                    responsible
                )
            )

        } catch (error) {
            throw new CustomError(
                error.statusCode || 400,
                error.message
            )
        }
    }
}