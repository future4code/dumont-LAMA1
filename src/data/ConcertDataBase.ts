import { ConcertClass, concerts } from "../business/entities/Concert";
import BaseDataBase from "./BaseDataBase";

export class ConcertDataBase extends BaseDataBase {

    protected static TABLE_NAME: string = "lama_concerts"

    
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
            .into(ConcertDataBase.TABLE_NAME)

        } catch(error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public async getConcertByDay(day: string): Promise <concerts | undefined> {

        try{
            const result = await BaseDataBase.connection
            .select("*")
            .from(ConcertDataBase.TABLE_NAME)
            .where({day})
            .groupBy({day})

            return result[0]
            // const allConcerts: concerts[] = []
            // for (let concert of result) {
            //     allConcerts.push(ConcertDataBase.)
            // }

        } catch(error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}