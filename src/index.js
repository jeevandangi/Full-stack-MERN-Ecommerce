import { connect_db}  from "./db/connect_db.js";
import dotenv from "dotenv"
import { app } from "./app.js";
dotenv.config({
    path:"./env"
})

connect_db()
.then(()=>{
    console.log("connected succesfull")
    app.get('/',(req,res)=>{
        res.send(req.cookies)
        console.log("cookie parsed")
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server listening to port ${process.env.PORT}`);
        
    })
})
.catch()