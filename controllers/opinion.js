const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function setMyOpinion(req, res) { 
    const {enterprise_name,score,date_update,description,student,student_id,ruc} = req.body
    const data = true;

    res.status(200).send(data);

    // connection.end();

}
async function updateMyOpinion(req, res) { 
    const {id,enterprise_name,score,date_update,description,student,student_id,ruc} = req.body

    const data = true;

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    setMyOpinion,
    updateMyOpinion
}