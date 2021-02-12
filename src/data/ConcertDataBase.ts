import { ConcertClass } from "../business/entities/Concert";
import BaseDataBase from "./BaseDataBase";

export class ConcertDataBase extends BaseDataBase {

    protected static tableName: string = "lama_concerts"

    public async createConcert(concert: ConcertClass): Promise<void> {
        try{
            await BaseDataBase.connection
            .insert({
                id: concert.getId(),
                week_day: concert.getWeekDay(),
                start_time: concert.getStartTime(),
                end_time: concert.getEndTime(),
                band_id: concert.getBandId()
            })
            .into(ConcertDataBase.tableName)

        } catch(error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}