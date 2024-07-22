import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.DATABASE_URL);

const db = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Puedes ajustar esto según tu configuración de SSL
    },
  },
  models: [__dirname + "/../models/**/*"],
  logging: false,
});

export default db;
