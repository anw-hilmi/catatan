import express from "express";
import cors from "cors";
import routes from "../routes/index.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

const createServer = () => {
  const app = express();

  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",")
    : [];

  const corsOptions = {
    origin: allowedOrigins,
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Server Catatan Bersama berjalan!");
  });

  app.use("/api", routes);
  app.use(errorMiddleware);

  return app;
};

export default createServer;
