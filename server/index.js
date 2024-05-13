import app from './app.js'
import { dbConnection } from './database/db.js';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.listen(process.env.PORT, () => { // note in .env file we have used PORT=key keep in mind do not give space in equal to PORT=key  }
    try {
        dbConnection();
        console.log("server is listening at port", process.env.PORT);

    } catch (error) {
        console.log("error in server listening",error)
    }
   
})