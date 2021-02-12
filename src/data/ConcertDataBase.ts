import { ConcertClass } from "../business/entities/Concert";
import BaseDataBase from "./BaseDataBase";

export class ConcertDataBase extends BaseDataBase {

    protected static TABLE_NAME: string = "lama_concerts"

    private static toConcertModel(concert: any) {
        return concert && new ConcertClass(
             concert.id,
             concert.week_day,
             concert.start_time,
             concert.end_time,
             concert.band_id
        )
    }
    
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

    public async getConcertByDay(day: string): Promise <ConcertClass[] | undefined> {

        try{
            const result = await BaseDataBase.connection
            .select("*")
            .from(ConcertDataBase.TABLE_NAME)
            .where({week_day : day})
          
            const allConcerts: ConcertClass[] = []
            for (let concert of result) {
                allConcerts.push(ConcertDataBase.toConcertModel(concert))
            }

            return allConcerts

        } catch(error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}