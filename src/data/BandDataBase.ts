import { Band } from "../business/entities/Band";
import { CustomError } from "../business/error/CustomError";
import BaseDataBase from "./BaseDataBase";

export class BandDataBase extends BaseDataBase {

    private static TABLE_NAME = "lama_bands"

    private static toBandModel (band: any) {
        return band && new Band(
            band.id,
            band.name,
            band.music_genre,
            band.responsible
        )
    }

    public async createBand(
        band: Band
    ): Promise<void> {
        try {
            await BaseDataBase.connection
                .insert({
                    id: band.id,
                    name: band.name,
                    music_genre: band.musicGenre,
                    responsible: band.responsible
                })
                .into(BandDataBase.TABLE_NAME)
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async selectBandById(
        id: string
    ): Promise<Band> {
        try {
            const result = await BaseDataBase.connection
                .select("*")
                .from(BandDataBase.TABLE_NAME)
                .where({ id })
                
            return BandDataBase.toBandModel(result[0])
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async selectBandByName(
        name: string
    ): Promise<Band> {
        try {
            const result = await BaseDataBase.connection.raw(`
                SELECT * FROM ${BandDataBase.TABLE_NAME}
                WHERE name LIKE "%${name}%"
            `)
                
            return BandDataBase.toBandModel(result[0][0])
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }

    public async selectAllBands() 
    : Promise<Band[]> {
        try {
            const result = await BaseDataBase.connection
                .select("*")
                .from(BandDataBase.TABLE_NAME)
                
            const bands: Band[] = []
            for (let band of result) {
                bands.push(
                    BandDataBase.toBandModel(band)
                )
            }

            return bands
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }
}