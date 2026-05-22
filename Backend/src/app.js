import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import session from 'express-session';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static('public'));
app.use(cookieParser());
app.use(session(
    {
        secret: "reminderai_secret",
        resave: false,
        saveUninitialized: true,
    }
));

import calendarRoute  from "./routes/calendar.route.js"
import syncRoutes from "./routes/sync.route.js";
import userRoutes from "./routes/user.route.js";

app.use("/api/calendar",calendarRoute);
app.use("/api/sync", syncRoutes); //router.post("/addreminder", addReminder);
app.use("/api/user",userRoutes);




export { app };