// app.js
import express from "express";
import { response } from "express";
const app = express();
const port = 5100;
app.get("/", (req, res) => {
    console.log("Server running at http://127.0.0.1:5100/");
    response.send("Hello, world!");
});
app.listen(port);
