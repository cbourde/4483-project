const express = require("express");

let server = express();

server.use(express.static("static"));

server.listen(5000);