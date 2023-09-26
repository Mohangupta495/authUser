import express from "express"
import cors from "cors"
import compression from "compression";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose"
import router from "./src/routers/index";

const app = express();
dotenv.config();
app.use(cors({
    credentials: true,
}))
app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

//   connect with mongo db
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL as string);
mongoose.connection.on("error", (error: Error) => { console.log(error) });

// routers
app.use("/", router());
