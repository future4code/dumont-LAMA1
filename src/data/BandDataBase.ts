import { Band } from "../business/entities/Band";
import { CustomError } from "../business/error/CustomError";
import BaseDataBase from "./BaseDataBase";

export class BandDataBase extends BaseDataBase {

    private static TABLE_NAME = "lama_bands"

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
                .into(BandDataBase.TABLE_NAME);
        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred");
        }
    }
}