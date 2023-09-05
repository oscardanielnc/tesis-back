const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getSpecialties(req, res) { 

    const data = [
        {
            value: '1',
            name: 'Ingeniería informática',
            cycles: 10
        },
        {
            value: '2',
            name: 'Derecho',
            cycles: 12
        },
    ]

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    getSpecialties
}