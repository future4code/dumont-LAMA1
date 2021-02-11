import { Request, Response } from "express"
import { BandBusiness } from "../business/BandBusiness";
import { BandInputDTO } from "../business/entities/Band";
import { BandDataBase } from "../data/BandDataBase";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/TokenGenerator";

const bandBusiness = new BandBusiness(
    new IdGenerator(),
    new Authenticator(),
    new BandDataBase()
)

export class BandController {    

    public async createBand (req: Request, res: Response) {
        try {
            const token: string = req.headers.authorization!
            const input: BandInputDTO = {
                name: req.body.name,
                musicGenre: req.body.musicGenre,
                responsible: req.body.responsible
            }

            bandBusiness.createBand(token, input)

            res.status(200).send("Band created successfuly")

        } catch (error) {
            res
            .status(error.statusCode || 400)
            .send({ error: error.message });
        }
    }
}