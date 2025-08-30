"use strict";
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/.env` });
const app = express();
app.set("view engine", "ejs");
app.listen(3000);
