const express = require("express");
const bodyParser = require("body-parser");
const properties = require("./properties.js");

const listeningPort = process.env.PORT || properties.port;
const serverName = properties.server_name;
const clientDir = properties.clientDir;

const bodyParserLimit = "50mb";

function ServerListening(req, res, next) {
    console.info(serverName + " [listening on port: " + listeningPort + "].");
}

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json({
    limit: bodyParserLimit
}));

app.use(bodyParser.urlencoded({
    limit: bodyParserLimit,
    extended: true,
    parameterLimit: 50000
}));

app.use(express.static("./"));

const server = app.listen(listeningPort, ServerListening);

app.get("/*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
