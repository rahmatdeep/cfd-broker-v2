import express from "express";
import cors from "cors";
import router from "./routes/routes";

const PORT = process.env.HTTP_PORT || 3200;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(PORT, () => console.log(`HTTP server listening on ${PORT}`));
