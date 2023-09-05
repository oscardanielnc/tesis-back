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
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100'
            },
            {
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100'
            },
            {
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100'
            },
        ]
    }

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    enterpriseData
}