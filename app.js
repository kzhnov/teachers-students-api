const express = require("express");
const cors = require("cors");
require('dotenv').config();

const api = require("./src/routes/api");

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("REST API for teachers where they can perform administrative functions for their students.");
});

app.use("/api", api);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
