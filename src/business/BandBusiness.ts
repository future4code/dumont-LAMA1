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
                    "Missing inputs"
                )
            }

            const bands = await this.bandDatabase.selectAllBands()
            const bandAlreadyExists = bands && bands.find((band) => band.name === name)

            if (bandAlreadyExists) {
                throw new CustomError(422, "Band name already registered")
            }

            const id: string = this.idGenerator.generate()
            const band = new Band(
                id,
                name,
                musicGenre,
                responsible
            )

            await this.bandDatabase.createBand(band)

            return band

        } catch (error) {
            throw new CustomError(
                error.statusCode || 400,
                error.message
            )
        }
    }

    public async getBandByProperty(
        token: string,
        id: string,
        name: string
    ): Promise<Band> {
        try {
            this.authenticator.getData(token);

            if (!id && !name) {
                throw new CustomError(406, "Please inform 'id' or 'name' to proceed the query")
            }

            let band: Band

            if (id) {
                band = await this.bandDatabase.selectBandById(id)
            } else {
                band = await this.bandDatabase.selectBandByName(name)
            }
            
            if (!band) {
                throw new CustomError(404, "Band not found")
            }

            return band

        } catch (error) {
            throw new CustomError(
                error.statusCode || 400,
                error.message
            )
        }
    }
}