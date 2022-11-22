const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const port = process.env.PORT || 9000;

const app = express();

app.use(cors());

app.get("/tr", (request, res) => {
    const requestQuery = request.query;
    const ev = requestQuery?.ev;
    const icon = requestQuery?.icon;
    const platform = requestQuery?.platform;

    /* const MySQLConnection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    })
    
    MySQLConnection.connect((err) => {
        if (err) throw err;
        console.log("Connected!");
    
        MySQLConnection.query("CREATE DATABASE analytics_insights", (err, results) => {
            if (err) throw err;
            console.log("Database created!");
        })
    }) */

    res.json({ msg: "Hi you are now on", platform: platform })
});

app.listen(port, () => {
    console.log(`Listen on port ${port}`);
})