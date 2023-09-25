const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function addSignatory(req, res) {

    const {name, last_name, email} = req.body;
        
    const result = true

    res.status(200).send({result: result, success: true, message: ""});

    // connection.end();
}
async function updateSignatory(req, res) {

    const {id, active} = req.body;
        
    const result = true

    res.status(200).send({result: result, success: true, message: ""});

    // connection.end();
}
async function getSignatories(req, res) {

    const {name} = req.body;
        
    const data = [
        {
            id: '12',
            name: 'Ernesto', 
            last_name: 'Quiñores', 
            email: 'e.quiñores@pucp.edu.pe',
            role: "FIRMANTE",
            update_date: "2023/09/09",
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            active: true
        },
        {
            id: '13',
            name: 'Ernesto', 
            last_name: 'Quiñores', 
            email: 'e.quiñores@pucp.edu.pe',
            role: "EVALUADOR",
            update_date: "2023/09/09",
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            active: false
        },
        {
            id: '14',
            name: 'Ernesto', 
            last_name: 'Quiñores', 
            role: "FIRMANTE",
            email: 'e.quiñores@pucp.edu.pe',
            update_date: "2023/09/09",
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            active: true
        },
    ]

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();
}


module.exports = {
    addSignatory,
    getSignatories,
    updateSignatory
}