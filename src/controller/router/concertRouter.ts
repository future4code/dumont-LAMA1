import express from "express";
import { ConcertController } from "../ConcertController";

export const concertRouter = express.Router();

const concertController = new ConcertController();

concertRouter.post("/create", concertController.createConcert);
//userRouter.post("/login", userController.login);
