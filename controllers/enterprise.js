const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function enterpriseData(req, res) { 
    const {idUser} = req.params;

    const data = {
        ads: [
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                description: 'Breve descripsión del puesto de trabajo...'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                description: 'Breve descripsión del puesto de trabajo...'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                description: 'Breve descripsión del puesto de trabajo...'
            },
        ],
        opinions: [
            {
                id: '123',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100',
                ruc: '20000000022'
            },
            {
                id: '123',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100',
                ruc: '20000000022'
            },
            {
                id: '123',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100',
                ruc: '20000000022'
            },
        ]
    }

    res.status(200).send(data);

    // connection.end();

}

async function enterpriseExist(req, res) { 
    const {ruc} = req.params;

    const data = {
        exist: true,
        ruc: ruc,
        name: "IBM de Peru",
        photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
    };

    res.status(200).send(data);

    // connection.end();

}
async function getEnterprises(req, res) { 
    const {value} = req.body;

    const data = [
        {
            id: '1',
            name: 'IBM del Peru',
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            ruc: '2030405060',
            update_date: '08/08/2023',
            active: true
        },
        {
            id: '2',
            name: 'IBM del Peru',
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            ruc: '2030405060',
            update_date: '08/08/2023',
            active: true
        },
        {
            id: '3',
            name: 'IBM del Peru',
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            ruc: '2030405060',
            update_date: '08/08/2023',
            active: true
        },
    ]

    res.status(200).send(data);

    // connection.end();

}

async function updateEnterprise(req, res) { 
    const {id, active} = req.body;

    const data = true

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    enterpriseData,
    enterpriseExist,
    getEnterprises,
    updateEnterprise
}