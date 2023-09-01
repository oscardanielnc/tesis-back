const fs = require('fs'),
http = require('http'),
https = require('https'),
express = require('express');

const app = require("./app")

const { API_VERSION, IP_SERVER, PORT_SERVER } = require("./config")

const privateKey = fs.readFileSync('/etc/letsencrypt/live/inf245devpanda.inf.pucp.edu.pe/privkey.pem', 'utf8').toString();
const certificate = fs.readFileSync('/etc/letsencrypt/live/inf245devpanda.inf.pucp.edu.pe/cert.pem', 'utf8').toString();

const options = {
key: privateKey,
cert: certificate
};


https.createServer(options, app).listen(443, ()=> {
    console.log("################################")
    console.log("##### PSP - tesis API REST #####")
    console.log("################################")
console.log(`${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}/`)
})