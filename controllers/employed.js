const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');
const { getDateByNumber } = require('../utils/general-functions');

async function employedData(req, res) { 
    const {idUser,enterprise_id} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de estudiante";

    const user = {
        ads: [],
        agreements: []
    }

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM job WHERE id_enterprise=${enterprise_id} AND active=1 ORDER BY end_ad_date;`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sql = `SELECT * FROM benefit WHERE id_job=${it.id_job} AND active=1;`
            const r =  await sqlAsync(sql, connection);
            let desc = '';
            if(r.length>0) desc = r[0].descripcion;

            const item = {
                job_title: it.title,
                enterprise_name: '',
                date_end: it.end_ad_date,
                code: `${it.id_job}`,
                enterprise_id: enterprise_id,
                description: desc.substring(0,60)
            }
            if(item.date_end > nowTime()) user.ads.push(item)
        }

        sqlQuery = `SELECT * FROM agreement WHERE id_employed=${idUser} AND active=1;`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sqlj = `SELECT * FROM job WHERE id_job=${it.id_job};`
            const j =  await sqlAsync(sqlj, connection);
            const job = j[0];

            const item = {
                job_title: job.title,
                id: it.id_agreement,
                date_sign: getDateByNumber(it.date_enterprise), 
            }
            user.agreements.push(item)
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

    // const data = {
    //     ads: [
    //         {
    //             job_title: "Desarrollador de software",
    //             enterprise_name: "IBM del Perú", 
    //             date_end: "08-08-2023",
    //             code: 'C0987',
    //             enterprise_id: '200',
    //             description: 'Breve descripsión del puesto de trabajo...'
    //         },
    //         {
    //             job_title: "Desarrollador de software",
    //             enterprise_name: "IBM del Perú", 
    //             date_end: "08-08-2023",
    //             code: 'C0987',
    //             enterprise_id: '200',
    //             description: 'Breve descripsión del puesto de trabajo...'
    //         },
    //         {
    //             job_title: "Desarrollador de software",
    //             enterprise_name: "IBM del Perú", 
    //             date_end: "08-08-2023",
    //             code: 'C0987',
    //             enterprise_id: '200',
    //             description: 'Breve descripsión del puesto de trabajo...'
    //         },
    //     ],
    //     agreements: [
    //         {
    //             job_title: "Desarrollador de software",
    //             date_sign: "08-08-2023",
    //             id: '1234'
    //         },
    //         {
    //             job_title: "Desarrollador de software",
    //             date_sign: "08-08-2023",
    //             id: '1234'
    //         },
    //         {
    //             job_title: "Desarrollador de software",
    //             date_sign: "08-08-2023",
    //             id: '1234'
    //         },
    //         {
    //             job_title: "Desarrollador de software",
    //             date_sign: "08-08-2023",
    //             id: '1234'
    //         },
    //         {
    //             job_title: "Desarrollador de software",
    //             date_sign: "08-08-2023",
    //             id: '1234'
    //         },
    //     ]
    // }

}


async function getEmployees(req, res) { 
    const {name,job,reader,signatory,recruiter} = req.body;

    const data = [
        {
            name: "Juan León Osorio",
            job: "Comunity Manager", 
            date_update: '08-08-2023',
            user_id: '2030',
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
            user_id: '20220',
            reader: false,
            signatory: false,
            recruiter: false,
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
    ]

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function changePrivToEmployed(req, res) { 
    const {name,job,reader,signatory,recruiter} = req.body;
    
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}


module.exports = {
    employedData,
    getEmployees,
    changePrivToEmployed
}