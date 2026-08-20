import express from "express";
import { config } from "dotenv";
config();
import DBConnection from "./config/db.connection.js";
import moduleRoutes from "./routes/module.routes.js";
import coversationRoutes from "./routes/conversation.routes.js";
const app = express();
app.use(express.json());
app.get("/api/docs", (req, res) => {
  res.redirect(`${API_DOCS_URL}`);
});
app.use("/api/v1/module",moduleRoutes)
app.use("/api/v1/conversation",coversationRoutes)
app.listen(process.env.PORT, async () => {
  console.log("Our App is working on " + process.env.PORT);
  await DBConnection();
});