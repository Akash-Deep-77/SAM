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
import facultyRouter from './routes/faculty.routes.js';
import studentRouter from './routes/student.routes.js';
import sessionRouter from './routes/session.routes.js';
import attendanceRouter from './routes/attendance.routes.js';

// routes declaration
app.use("/api/v1/landingpage", instituteRouter);
app.use("/api/v1/faculty", facultyRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/session", sessionRouter);
app.use("/api/v1/attendance", attendanceRouter);

export { app };