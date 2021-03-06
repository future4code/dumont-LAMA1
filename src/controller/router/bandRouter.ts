import express from "express"
import { BandController } from "../BandController"

export const bandRouter = express.Router()
const bandController = new BandController()

bandRouter.post("/", bandController.createBand)
bandRouter.get("/search", bandController.getBandByProperty)