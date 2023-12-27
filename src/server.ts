import express, { Express } from "express";
import apiRoutes from "./routes/routes";
import http from "http";
import config from "./config";
import database from "./database";
import { blue, bold, yellow } from "colors";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { Server } from "socket.io";
import initializeSocket from "./socket";


const app: Express = express();
const PORT: number = parseInt(config.PORT as string, 10);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


//Logger
morgan(':method :url :status :res[content-length] - :response-time ms')


// Cors Policy
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', optionsSuccessStatus: 204 }));
app.options('*', cors());


//Database Connection
database();


//Initialize Routes
app.use("/api", apiRoutes);

initializeSocket(io);

//Listening to PORT
server.listen(PORT, (): void =>
  console.log(`${blue("Server Running On PORT: ")} ${bold(
    blue(`${config.PORT}`)
  )}
${yellow("API URL: ")} ${blue(`http://localhost:${config.PORT}/api`)}`)
);
