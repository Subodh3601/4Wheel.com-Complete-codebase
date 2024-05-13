import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "w4Outlook",
    }).then(() => {
        console.log("connecte to mongo")
    }

    ).catch(
        err => {
            console.log("error in db connection", err)
        }
    )
}