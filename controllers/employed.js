const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function employedData(req, res) { 
    const {idUser} = req.params;

    const data = {
        ads: [
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                enterprise_id: '200',
                description: 'Breve descripsión del puesto de trabajo...'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                enterprise_id: '200',
                description: 'Breve descripsión del puesto de trabajo...'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                enterprise_id: '200',
                description: 'Breve descripsión del puesto de trabajo...'
            },
        ],
        agreements: [
            {
                job_title: "Desarrollador de software",
                date_sign: "08-08-2023",
                id: '1234'
            },
            {
                job_title: "Desarrollador de software",
                date_sign: "08-08-2023",
                id: '1234'
            },
            {
                job_title: "Desarrollador de software",
                date_sign: "08-08-2023",
                id: '1234'
            },
            {
                job_title: "Desarrollador de software",
                date_sign: "08-08-2023",
                id: '1234'
            },
            {
                job_title: "Desarrollador de software",
                date_sign: "08-08-2023",
                id: '1234'
            },
        ]
    }

    res.status(200).send(data);

    // connection.end();

}


async function getEmployees(req, res) { 
    const {idUser} = req.params;

    const data = [
        {
            name: "Juan León Osorio",
            job: "Comunity Manager", 
            date_update: '08-08-2023',
            user_id: '200',
            reader: true,
            signatory: true,
            recruiter: true,
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            name: "Juan León Osorio",
            job: "Comunity Manager", 
            date_update: '08-08-2023',
            user_id: '200',
            reader: true,
            signatory: false,
            recruiter: false,
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            name: "Juan León Osorio",
            job: "Comunity Manager", 
            date_update: '08-08-2023',
            user_id: '200',
            reader: false,
            signatory: false,
            recruiter: false,
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    employedData,
    getEmployees
}