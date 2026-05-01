import dotenv from "dotenv";
import connectDB from "./db/index.js";

import dns from 'dns';
// Change DNS to resolve 'ECONNREFUSED' error caused by SRV format
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config({
    path: './.env'
})



connectDB()
.then( () => {
    app.on("error", (err) => {
      console.log("ERROR: ", err);
      throw err;
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
.catch( (err) => {
    console.log("MONGO db connection failed !!!", err);
})
