import express from "express"
import cors from "cors"
import { Mongo } from "./database/mongo.js"
import {config} from 'dotenv'
import authRouter from './auth/auth.js'

config()
async function main() {
    const hostname = 'localhost'
    const port = 3000

    const app = express()

    const mongoConnection = await Mongo.connect(process.env.MONGO_CONNECTION_STRING, process.env.MONGO_DB_NAME)
    console.log(mongoConnection)


    app.use(express.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'Wellcome to my EventFlow'
        })
    })

    app.use('/auth', authRouter)

    app.listen(port, () => {
        console.log(`Server runnig on: http://${hostname}:${port}`);
    })
}

main()