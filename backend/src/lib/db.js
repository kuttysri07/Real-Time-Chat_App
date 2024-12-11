import mongoose from "mongoose";

export const ConnectDb = async () =>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDb Connected:${connect.connection.host}`)
    } catch (error) {
        console.log(`MongoDb Connection Error :${error}`)
    }
};