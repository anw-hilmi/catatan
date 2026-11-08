import express from "express";
import cors from "cors";
import routes from "../routes/index.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

const createServer = () => {
  const app = express();

  const corsOptions = {
    origin: ["http://localhost:5173", "https://catatann-six.vercel.app"],
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
