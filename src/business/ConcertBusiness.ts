import { ConcertDataBase } from "../data/ConcertDataBase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";
import { ConcertClass, concertInputDTO, stringToWeekDay } from "./entities/Concert";
import { AuthenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class ConcertBusiness {

    constructor(
        private tokenGenerator: Authenticator, 
        private concertDataBase: ConcertDataBase,
        private idGenerator: IdGenerator
    ) {}

    public async createConcert (concert: concertInputDTO, token: string) {

        try {

            if(!concert.weekDay || !concert.startTime || !concert.endTime || !concert.bandId) {
                throw new CustomError(422, "Missin input. Plase fill in the fields: 'weekDay', 'startTime', 'endTime' and 'bandId' ")
            }

            const verifyToken: AuthenticationData = this.tokenGenerator.getData(token)

            if(!verifyToken.role && verifyToken.role !== "ADMIN") { 
                throw new CustomError(401, "Unauthorized")
            } //testar qual erro vai cair 

            if(concert.startTime < 8 || concert.endTime > 23 || concert.startTime >= concert.endTime) {
                throw new CustomError(422, "The concerts should start at 08h and end at 23h")
            }

            if(!Number.isInteger(concert.startTime) || !Number.isInteger(concert.endTime)) {
                throw new CustomError(422, "Only integer numbers are valid")
            }

            // const allConcerts = await this.concertDataBase.getConcertByDay(concert.weekDay)
            // const compareTime = allConcerts && allConcerts.find((concert) => concert.startTime === startTime || concert.endTime === endTime) 

            const id = this.idGenerator.generate()

            await this.concertDataBase.createConcert(
                 new ConcertClass(
                    id, 
                    stringToWeekDay(concert.weekDay),
                    concert.startTime,
                    concert.endTime,
                    concert.bandId
                )
            )
               
        } catch (error) {
            throw new CustomError(
                error.statusCode || 400, error.message
            )
        }
    }
}