const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getJobs(req, res) { 

    const {job,enterprise,location,languages,modality,sector,
        salary_min,salary_max,date_init,date_end} = req.body;

    const data = [
        {
            job_title: "Desarrollador de software",
            enterprise_name: "IBM del Perú", 
            date_end: "08-08-2023",
            code: 'C0987',
            salary: 1025,
            location: 'Lima',
            modality: 'Virtual',
            description: 'Breve descripsión del puesto de trabajo...',
            enterprise_id: '200',
            enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            job_title: "Desarrollador de software",
            enterprise_name: "IBM del Perú", 
            date_end: "08-08-2023",
            code: 'C0987',
            salary: 1025,
            location: 'Lima',
            modality: 'virtual',
            description: 'Breve descripsión del puesto de trabajo...',
            enterprise_id: '200',
            enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
        {
            job_title: "Desarrollador de software",
            enterprise_name: "IBM del Perú", 
            date_end: "08-08-2023",
            code: 'C0987',
            salary: 1025,
            location: 'Lima',
            modality: 'virtual',
            description: 'Breve descripsión del puesto de trabajo...',
            enterprise_id: '200',
            enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}

async function getJobByCode(req, res) { 
    const {code} = req.params;

    const data = {
        enterprise_name: "IBM del Perú", 
        enterprise_score: 3,
        enterprise_id: '100',
        enterprise_sector: 'Consultoría',
        enterprise_location: 'Lima',
        enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
        job_title: "Desarrollador de software",
        code: 'C0987',
        date_end: "2023-08-08",
        job_start: "2023-08-09",
        job_end: "2023-08-10",
        salary: 1025,
        modality: 'Virtual',
        vacancies: 0,
        max_applicants: 0,
        registered: 36,
        alredy_applied: false,
        sections: [
            {
                title: "Acerca del empleo",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                title: "Principales actividades",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                title: "Compenetencias requeridas",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
            {
                title: "Beneficios adicionales",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            },
        ]
    }

    res.status(200).send(data);

    // connection.end();

}

async function applyJob(req, res) { 
    const {idUser, code} = req.body;

    const data = true
    res.status(200).send(data);

    // connection.end();

}

async function createJob(req, res) { 
    const {job,salary,date_end,modality,vacancies,max,job_start,job_end,sections} = req.body;

    const data = {success: true, code: 'C567'}
    res.status(200).send(data);

    // connection.end();

}
async function updateJob(req, res) { 
    const {job_title,code,date_end,job_start,job_end,salary,
        modality,vacancies,max_applicants,sections} = req.body;
    const data = true
    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    getJobs,
    getJobByCode,
    applyJob,
    createJob,
    updateJob
}




