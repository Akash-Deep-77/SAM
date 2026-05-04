import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
// (used to store static files) app.use(express.static("public"));
app.use(cookieParser());


// routes import
import instituteRouter from './routes/institute.routes.js';


// routes declaration
app.use("/api/v1/landingpage", instituteRouter)


export { app };