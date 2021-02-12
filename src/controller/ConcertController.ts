import { Request, Response } from "express";
import { ConcertBusiness } from "../business/ConcertBusiness"
import { concertInputDTO } from "../business/entities/Concert"
import { ConcertDataBase } from "../data/ConcertDataBase";
import { IdGenerator } from "../services/IdGenerator"
import { Authenticator } from "../services/TokenGenerator"

const concertBusiness = new ConcertBusiness(
    new Authenticator(),
    new ConcertDataBase(),
    new IdGenerator()
)

export class ConcertController {

    public async createConcert (req: Request, res: Response) {

      try {

        const token: string = req.headers.authorization as string

        const input: concertInputDTO = {
            weekDay: req.body.weekDay, 
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            bandId: req.body.bandId,
        }

        concertBusiness.createConcert(input, token)

        res.status(200).send("scheduled concert")
        
      } catch (error) {
        res
        .status(error.statusCode || 400).send({ error: error.message })
      }
    }
}