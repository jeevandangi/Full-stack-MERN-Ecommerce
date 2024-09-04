import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import { router } from "./route/user.routes.js"


const app =  express();


app.use(express.json({
    limit:"16kb"
}))

app.use(cors({
    origin:"process.env.CORS"
}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(morgan("dev"))


app.use("/api/v1/user", router)


export {app}