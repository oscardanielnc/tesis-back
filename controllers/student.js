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
                id: '123',
                title: "Desarrollador de software 1",
                icon: -1,
                enterprise_name: "IBM del Peru",
                date_init: "2023-09-02",
                date_end: "2023-09-02",
                description: "Buena experiencia...",
                enterprise_id: '200',
                ruc: '20123456789',
                enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
            },
            {
                id: '1233',
                title: "Desarrollador de software 2",
                icon: -1,
                enterprise_name: "IBM del Peru",
                date_init: "2023-09-02",
                date_end: "2023-09-02",
                description: "Buena experiencia...",
                enterprise_id: '200',
                ruc: '20123456789',
                enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
            },
        ],
        certificates: [
            {
                id: '12333',
                title: "Voluntario como asistente de medicina",
                icon: 1,
                enterprise_name: "Marina de guerra del Perú",
                date_init: "2023-09-02",
                date_end: "2023-09-02",
                description: "Buena experiencia...",
                enterprise_id: '200',
                ruc: '',
                enterprise_photo: ''
            },
            {
                id: '123333',
                title: "Curso de programación con Angular",
                icon: 2,
                enterprise_name: "Udemy",
                date_init: "2023-09-02",
                date_end: "2023-09-02",
                description: "Buena experiencia...",
                enterprise_id: '200',
                ruc: '',
                enterprise_photo: ''
            },
        ],
        agreements: [
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú",
                id: '12345'
            },
        ],
        ads: [
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987'
            },
        ],
        opinions: [
            {
                id: '12355',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro"
            },
            {
                id: '1243',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro"
            },
            {
                id: '12344',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro"
            },
        ]
    }

    res.status(200).send(data);

    // connection.end();

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

    res.status(200).send(data);

    // connection.end();

}

async function contractStudent(req, res) { 
    const {student, enterprise} = req.body;
    
    const data = true

    res.status(200).send(data);

    // connection.end();

}

module.exports = {
    studentData,
    getStudents,
    contractStudent
}