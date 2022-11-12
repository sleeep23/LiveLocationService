// app.js
import express from "express";
import cors from "cors";

const app = express();
const port = 5100;

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
  })
);

app.get("/", (req, res) => {
  res.send({ test: "hi" });
});

app.get("/*", (req, res) => {
  res.redirect("/");
});

app.listen(port);
console.log("Server listening on http://127.0.0.1:5100/");
