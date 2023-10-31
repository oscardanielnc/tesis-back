const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function setMyOpinion(req, res) { 
    const {enterprise_name,score,date_update,description,student,student_id,ruc} = req.body
    const data = true;

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function updateMyOpinion(req, res) { 
    const {id,enterprise_name,score,date_update,description,student,student_id,ruc} = req.body

    const data = true;

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function updateMyOpinion(req, res) { 
    const {id,enterprise_name,score,date_update,description,student,student_id,ruc} = req.body

    const data = true;

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function getOpinions(req, res) { 
    const {id} = req.body

    const data = [
        {
            id: '1',
            enterprise_name: 'IBM del Perú',
            score: 3,
            date_update: '12/01/2023',
            description: 'Experiencia agradable, pero demaciada carga de trabajo.',
            student: 'Oscar Navarro',
            student_id: '5',
            id_enterprise: `3`,
            state: 1
        },
        {
            id: '2',
            enterprise_name: 'IBM del Perú',
            score: 5,
            date_update: '12/01/2023',
            description: 'Experiencia agradable, pero demaciada carga de trabajo.',
            student: 'Daniel Navarro',
            student_id: '10',
            id_enterprise: `3`,
            state: 2
        },
    ];

    res.status(200).send({result: data, success: true, message: ""});

}


module.exports = {
    setMyOpinion,
    updateMyOpinion,
    getOpinions
}