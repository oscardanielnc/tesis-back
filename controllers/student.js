const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function studentData(req, res) { 
    const {idUser} = req.params;

    const data = {
        experience: [
            {
                title: "Desarrollador de software",
                icon: -1,
                enterprise_name: "IBM del Peru",
                date_init: "08-08-2023",
                date_end: "08-09-2023",
                description: "Buena experiencia...",
                enterprise_id: '200',
                enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
            },
            {
                title: "Desarrollador de software",
                icon: -1,
                enterprise_name: "IBM del Peru",
                date_init: "08-08-2023",
                date_end: "08-09-2023",
                description: "Buena experiencia...",
                enterprise_id: '200',
                enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
            },
        ],
        certificates: [
            {
                title: "Voluntario como asistente de medicina",
                icon: 1,
                enterprise_name: "Marina de guerra del Perú",
                date_init: "08-08-2023",
                date_end: "08-09-2023",
                description: "Buena experiencia...",
                enterprise_id: '200',
                enterprise_photo: ''
            },
            {
                title: "Curso de programación con Angular",
                icon: 2,
                enterprise_name: "Udemy",
                date_init: "08-08-2023",
                date_end: "08-09-2023",
                description: "Buena experiencia...",
                enterprise_id: '200',
                enterprise_photo: ''
            },
        ],
        agreements: [

        ],
        ads: [

        ],
        opinions: [

        ]
    }

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    studentData
}