const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getAgreements(req, res) { 

    const data = [
        {
            job_title: "Desarrollador de software",
            user_name: "IBM del Perú", 
            code: 'C0987',
            salary: 1025,
            job_start: '08-08-2019',
            job_end: '08-08-2020',
            location: 'Lima',
            state: 'Vigente',
            state_id: 1,
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

    const data = {
        job_title: "Desarrollador de software",
        enterprise_name: "IBM del Perú", 
        student_name: "Oscar Navarro",
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