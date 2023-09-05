const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getLocations(req, res) { 

    const data = [
        {
            value: '1',
            name: 'Lima'
        },
        {
            value: '2',
            name: 'Tarapoto'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}
async function getLanguage(req, res) { 

    const data = [
        {
            value: '1',
            name: 'Español'
        },
        {
            value: '2',
            name: 'Inglés'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    getLocations,
    getLanguage
}