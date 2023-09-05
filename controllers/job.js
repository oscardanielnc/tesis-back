const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getJobs(req, res) { 

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


module.exports = {
    getJobs
}