const express = require("express");
const mysql = require("mysql");

const app = express();

app.get("/tr", (request, response) => {
    response.send("Hi you are now on /tr")
});

app.listen(9000, () => {
    console.log("Listen on port 9000");
})