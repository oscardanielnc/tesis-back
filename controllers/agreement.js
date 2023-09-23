const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getAgreements(req, res) { 
    const {job,enterprise,student,employed,location,modality,
        salary_min,salary_max,state,date_end,date_init} = req.body;

    

    //agreement 
    // const sql1 = `SELECT * FROM agreement WHERE active=1`
    // const response1 = {}
    //user
    // const sql2 = `SELECT * FROM user WHERE id_user=${response1.id_student\response1.id_enterprise}`
    

    const data = [
        {
            job_title: "Desarrollador de software",//name
            user_name: "IBM del Perú", //response2.name, response2.lastname?
            code: 'C0987', //id_agreement
            salary: 1025, //response3(job).salary
            job_start: '08-08-2019', //init_date
            job_end: '08-08-2020', //end_date
            location: 'Lima',//response4(loccation).name
            state: 'Vigente',
            state_id: 1,
            user_id: '200',//response2.id_user
            doc_path: 'oiuyffghj', //document_path
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c' //response2.photo
        },
        {
            job_title: "Desarrollador de software",
            user_name: "IBM del Perú", 
            code: 'C0987',
            salary: 1025,
            job_start: '08-08-2019',
            job_end: '08-08-2020',
            location: '',
            state: 'Vencido',
            state_id: -1,
            user_id: '200',
            doc_path: 'oiuyffghj',
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            job_title: "Desarrollador de software",
            user_name: "IBM del Perú", 
            code: 'C0987',
            salary: 1025,
            job_start: '08-08-2019',
            job_end: '08-08-2020',
            location: 'Lima',
            state: 'Falta firmar',
            state_id: 0,
            user_id: '200',
            doc_path: 'oiuyffghj',
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            job_title: "Desarrollador de software",
            user_name: "IBM del Perú", 
            code: 'C0987',
            salary: 1025,
            job_start: '08-08-2019',
            job_end: '08-08-2020',
            location: 'Lima',
            state: 'En espera de firmas',
            state_id: 0,
            user_id: '200',
            doc_path: 'oiuyffghj',
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            job_title: "Desarrollador de software",
            user_name: "IBM del Perú", 
            code: 'C0987',
            salary: 1025,
            job_start: '08-08-2019',
            job_end: '08-08-2020',
            location: 'Lima',
            state: 'Sin convenio',
            state_id: 0,
            user_id: '200',
            doc_path: 'oiuyffghj',
            user_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },

    ]

    res.status(200).send(data);

    // connection.end();

}

async function getAgreementState(req, res) { 
    const {code} = req.params;
    // const sql1 = `SELECT * FROM agreement WHERE active=1`

    const data = {
        job_title: "Desarrollador de software", //name
        enterprise_name: "IBM del Perú", //r2(enterprise).name
        student_name: "Oscar Navarro",//r3(student).name,lastname
        enterprise_score: 3, 
        enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
        student_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
        enterprise_sector: 'Consultoría',
        enterprise_location: 'Lima',
        code: 'C0987',
        salary: 1025,
        enterprise_id: '200',
        student_id: '100',
        modality: 'Presencial',
        description: 'text text text text',
        observation_student: 'text text text text',
        observation_ie: '',
        observation_date_st: '2023/09/09',
        observation_date_ie: '',
        list: [
            {
                id: '200',
                photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                name: 'Oscar Daniel',
                role: 'STUDENT',
                date: '08-08-2023',
                attr: "Estudiante",
            },
            {
                id: '200',
                photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                name: 'Oscar Daniel',
                role: 'PROFESSOR',
                date: '08-08-2023',
                attr: "Universidad"
            },
            {
                id: '200',
                photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
                name: 'Oscar Daniel',
                role: 'EMPLOYED',
                date: '08-08-2023',
                attr: "Empresa"
            },
        ]
    }

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    getAgreements,
    getAgreementState
}