const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getSpecialties(req, res) { 
    const {name, active, admin} = req.body

    const data = [
        {
            value: '1',
            name: 'Ingeniería informática',
            cycles: 10,
            active: true,
            professors: [ //solo si admin true
                {
                    id: '12',
                    name: 'Ernesto', 
                    last_name: 'Quiñores', 
                    coordinator: true,
                    update_date: "2023/09/09",
                    photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                    active: true
                },
                {
                    id: '13',
                    name: 'Ernesto', 
                    last_name: 'Quiñores', 
                    coordinator: false,
                    update_date: "2023/09/09",
                    photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                    active: false
                },
                {
                    id: '14',
                    name: 'Ernesto', 
                    last_name: 'Quiñores', 
                    coordinator: false,
                    update_date: "2023/09/09",
                    photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                    active: true
                },
            ]
        },
        {
            value: '2',
            name: 'Derecho',
            cycles: 12,
            active: true,
            professors: [
                {
                    id: '12',
                    name: 'Ernesto', 
                    last_name: 'Quiñores', 
                    coordinador: true,
                    update_date: "2023/09/09",
                    photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                    active: true
                },
                {
                    id: '13',
                    name: 'Ernesto', 
                    last_name: 'Quiñores', 
                    coordinador: false,
                    update_date: "2023/09/09",
                    photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                    active: true
                },
                {
                    id: '14',
                    name: 'Ernesto', 
                    last_name: 'Quiñores', 
                    coordinador: false,
                    update_date: "2023/09/09",
                    photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                    active: true
                },
            ]
        },
    ]

    res.status(200).send(data);

    // connection.end();

}

async function createSpecialty(req, res) { 
    const {name, cycles, active} = req.body

    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function updateSpecialty(req, res) { 
    const {value, name, cycles, active} = req.body

    const data = true

    res.status(200).send(data);

    // connection.end();

}

module.exports = {
    getSpecialties,
    createSpecialty,
    updateSpecialty
}