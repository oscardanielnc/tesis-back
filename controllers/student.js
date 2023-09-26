const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');
const { nowTime, getDateByNumber } = require('../utils/general-functions');

async function studentData(req, res) { 
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    const {idUser} = req.params;

    let success = false
    let message = "Error en el servicio de estudiante";

    const user = {
        experience: [],
        certificates: [],
        agreements: [],
        ads: [],
        opinions: []
    }

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM certificate WHERE id_user=${idUser} AND active=1;`
        let result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const keyName = it.type===1? 'experience': 'certificates';
            const item = {
                ...it,
                date_init: getDateByNumber(it.date_init),
                date_end: getDateByNumber(it.date_end),
                id: `${it.id_certificate}`,
            }
            user[keyName].push(item)
        }

        sqlQuery = `SELECT * FROM agreement WHERE id_student=${idUser} AND active=1;`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sqlj = `SELECT * FROM job WHERE id_job=${it.id_job};`
            const j =  await sqlAsync(sqlj, connection);
            const job = j[0];
            const sqlu = `SELECT * FROM user WHERE id_user=${it.id_enterprise};`
            const u =  await sqlAsync(sqlu, connection);
            const us = u[0];

            const item = {
                job_title: job.title,
                enterprise_name: us.name,
                id: it.id_agreement
            }
            if(it.end_date > nowTime()) user.agreements.push(item)
        }

        sqlQuery = `SELECT * FROM studentxjob WHERE id_student=${idUser} AND active=1 AND relation='P';`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sqlj = `SELECT * FROM job WHERE id_job=${it.id_job};`
            const j =  await sqlAsync(sqlj, connection);
            const job = j[0];
            const sqlu = `SELECT * FROM user WHERE id_user=${job.id_enterprise};`
            const u =  await sqlAsync(sqlu, connection);
            const us = u[0];

            const item = {
                job_title: job.title,
                enterprise_name: us.name,
                date_end: job.end_ad_date,
                code: `${job.id_job}`
            }
            if(item.date_end > nowTime()) user.ads.push(item)
        }

        sqlQuery = `SELECT * FROM opinion WHERE id_creator=${idUser} AND active=1;`
        result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const item = {
                id: it.id_opinion,
                enterprise_name: it.enterprise,
                score: it.score,
                date_update: getDateByNumber(it.update_date),
                description: it.descripcion,
                student: it.student
            }
            user.opinions.push(item)
        }
        success = true
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: user, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();
}

async function getStudents(req, res) { 
    const {student,location,languages,specialty,oderby,type} = req.body

    const data = [
        {
            name: 'Oscar Navarro',
            specialty: 'Ingeniería informática',
            cycle: 10,
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            id: '10s0',
            cv_update: "08/08/2023",
            cv_path: '11',
            hired: false,
            languages: [
                {
                    value: '1',
                    name: 'Español',
                    level: 'Avanzado'
                },
                {
                    value: '2',
                    name: 'Inglés',
                    level: 'Básico'
                },
            ],
        },
        {
            name: 'Oscar Navarro',
            specialty: 'Ingeniería informática',
            cycle: 10,
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            id: '10w0',
            cv_update: "08/08/2023",
            cv_path: '11',
            hired: false,
            languages: [
                {
                    value: '1',
                    name: 'Español',
                    level: 'Avanzado'
                },
                {
                    value: '2',
                    name: 'Inglés',
                    level: 'Básico'
                },
            ],
        },
        {
            name: 'Oscar Navarro',
            specialty: 'Ingeniería informática',
            cycle: 10,
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            id: '100ws',
            cv_update: "08/08/2023",
            cv_path: '11',
            hired: false,
            languages: [
                {
                    value: '1',
                    name: 'Español',
                    level: 'Avanzado'
                },
                {
                    value: '2',
                    name: 'Inglés',
                    level: 'Básico'
                },
            ],
        },
    ]

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}

async function contractStudent(req, res) { 
    const {student, enterprise} = req.body;
    
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}

module.exports = {
    studentData,
    getStudents,
    contractStudent
}