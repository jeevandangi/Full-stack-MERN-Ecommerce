import mongoose from "mongoose"
import { dbName } from "../constants.js"
 


const connect_db=async()=>{
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`)
        
        
    } catch (error) {
        console.log("There is problem in connecting mongo database",error);
        throw(error);
    }
}


export {connect_db}