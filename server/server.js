const express = require("express");

let server = express();

server.use(express.static("docs"));

server.listen(5000);