import cors from "cors"
import express from "express"
import { AddressInfo } from "net";
import { bandRouter } from "./controller/router/bandRouter"
import { userRouter } from "./controller/router/userRouter"


const app = express()
app.use(express.json())
app.use(cors())
        
app.use("/user", userRouter)
app.use("/band", bandRouter)

const server = app.listen(3003, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Servidor rodando em http://localhost:${address.port}`);
   } else {
      console.error(`Falha ao rodar o servidor.`)
   }
})