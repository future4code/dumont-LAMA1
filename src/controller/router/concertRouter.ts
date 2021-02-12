import express from "express";
import { ConcertController } from "../ConcertController";

export const concertRouter = express.Router();

const concertController = new ConcertController();

concertRouter.post("/create", concertController.createConcert);
concertRouter.get("/all/:day", concertController.getConcertbyDay);
