const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function singIn(req, res) { 
    const {attr, value} = req.params;

    const user = {
        id: '100',
        role: "EMPLOYED",
        name: 'Oscar Navarro',
        lastname: 'Navarro Cieza',
        email: 'oscar.navarro@pucp.edu.pe',
        photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
        location: '2',
        location_name: 'Lima',
        uploadDateCV: '2002-08-30',
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
        description: "Estudiante de 9no ciclo de la carrera de ingeniería informática. Tercio superior. Inglés intermedio según Idiomas Católica. Con especial interés en el desarrollo de software y la experiencia de usuario (UX). Trabajé en la empresa IBM ayudando a sus clientes con el desarrollo y mantenimiento de sus aplicaciones. Full stack developer en web y mobile, especializado en Frontend. Autodidacta. Disfruto de enseñar lo que aprendo y de trabajar en equipo.",
        date: '2002-08-30',
        code: '20186008',
        specialty: 'Ingeniería informática',
        cycle: 8,
        max_cycles: 12,
        ruc: '2030405060',
        phone: '929178606',
        sector: 'Consultoría',
        numEmployees: '100 - 1000',
        job: 'Lead Manager',
        expire: new Date(),
        score: 4.7,
        enterprise_name: "IBM del Perú",
        reader: true,
        signatory: false,
        recruiter: true,
        enterprise_id: '100'
    }

    res.status(200).send(user);

    // connection.end();

}

async function signUp(req, res) {
    // const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    // connection.connect(err => {
    //     if (err) throw err;
    // });

    // const {email, photo} = req.body;
    const user = {
        id: '100',
        role: "EMPLOYED",
        name: 'Oscar Navarro',
        lastname: 'Navarro Cieza',
        cv_path: '',
        email: 'oscar.navarro@pucp.edu.pe',
        photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
        location: '2',
        location_name: 'Lima',
        uploadDateCV: '2002-08-30',
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
        description: "Estudiante de 9no ciclo de la carrera de ingeniería informática. Tercio superior. Inglés intermedio según Idiomas Católica. Con especial interés en el desarrollo de software y la experiencia de usuario (UX). Trabajé en la empresa IBM ayudando a sus clientes con el desarrollo y mantenimiento de sus aplicaciones. Full stack developer en web y mobile, especializado en Frontend. Autodidacta. Disfruto de enseñar lo que aprendo y de trabajar en equipo.",
        date: '2002-08-30',
        code: '20186008',
        specialty: 'Ingeniería informática',
        cycle: 8,
        max_cycles: 12,
        ruc: '2030405060',
        phone: '929178606',
        sector: 'Consultoría',
        numEmployees: '100 - 1000',
        job: 'Lead Manager',
        expire: new Date(),
        score: 4.7,
        enterprise_name: "IBM del Perú",
        reader: true,
        signatory: false,
        recruiter: true,
        enterprise_id: '100'
    }

    res.status(200).send(user);

    // connection.end();
}
async function updateProfile(req, res) {
    const result = true

    res.status(200).send(result);

    // connection.end();
}


module.exports = {
    singIn,
    signUp,
    updateProfile
}