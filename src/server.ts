import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerSpec, { swaggerUIOptions } from "./config/swagger";

//Conectar a base de datos

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    //console.log(colors.blue("Conexión exitosa a la BD"));
  } catch (error) {
    //console.log(error);
    console.log(colors.bgRed.white.bold("Hubo un error al conectar con la BD"));
  }
}

connectDB();

// Instancia de Express
const server = express();

// Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formulario
server.use(express.json());

server.use(morgan("dev"));
server.use("/api/products", router);

//Docs

server.use(
  "/docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerUIOptions)
);

export default server;
