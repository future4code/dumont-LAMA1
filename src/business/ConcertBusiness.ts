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

            const startTime = Number(concert.startTime)
            const endTime = Number(concert.endTime)

            if(startTime < 8 || endTime > 23 || startTime >= endTime) {
                throw new CustomError(422, "The concerts should start at 08h and end at 23h")
            }

            if(!Number.isInteger(startTime) || !Number.isInteger(endTime)) {
                throw new CustomError(422, "Only integer numbers are valid")
            }

            const allConcerts = await this.concertDataBase.getConcertByDay(concert.weekDay)
           
            if(!allConcerts) {
                throw new CustomError(404, "Concert not found")
            }

            const compareTime = allConcerts && allConcerts.filter((concert) => concert.getStartTime() === startTime || concert.getEndTime() === endTime) 

            if(compareTime.length) {
                throw new CustomError(400, "This time is not available")
            }

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