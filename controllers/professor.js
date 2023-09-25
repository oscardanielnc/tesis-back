const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function updateProfessor(req, res) {

    const {active, coordinator, id} = req.body;
    if(coordinator) {
        //significa que alguien debe pasar a false
    }
        
    const result = true

    res.status(200).send({result: result, success: result, message: ""});

    // connection.end();
}

module.exports = {
    updateProfessor
}