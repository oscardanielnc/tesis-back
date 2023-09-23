const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getLocations(req, res) {
    const {name} = req.body;

    const data = [
        {
            value: '1',
            name: 'Lima'
        },
        {
            value: '2',
            name: 'Tarapoto'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}
async function getLanguage(req, res) { 
    const {name} = req.body;

    const data = [
        {
            value: '1',
            name: 'Español'
        },
        {
            value: '2',
            name: 'Inglés'
        },
        {
            value: '3',
            name: 'Chino'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}
async function getSectors(req, res) { 
    const {name} = req.body;

    const data = [
        {
            value: '1',
            name: 'Consultoría'
        },
        {
            value: '2',
            name: 'Tecnologías de Información'
        },
        {
            value: '3',
            name: 'Telecomunicaciones'
        },
    ]

    res.status(200).send(data);

    // connection.end();

}
async function getEmailsSystem(req, res) { 

    const data = {
        support: "soporte@pucp.edu.pe",
        domain: "pucp.edu.pe",
    }

    res.status(200).send(data);

    // connection.end();

}
async function updateEmailsSystem(req, res) { 
    const {support,domain} = req.body;
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function setMyLenguage(req, res) { 
    // Relacionar un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function updateMyLenguage(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function deleteMyLenguage(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {userId, lanId} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function setMyCertificate(req, res) { 
    const {title,enterprise_name,icon,date_init,date_end,description,enterprise_id,enterprise_photo,ruc,type} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = {success: true, id: '1232222'}

    res.status(200).send(data);

    // connection.end();

}
async function updateMyCertificate(req, res) { 
    const {id,title,enterprise_name,icon,date_init,date_end,description,enterprise_id,enterprise_photo,ruc} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function deleteMyCertificate(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {id} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function maintenanceSysData(req, res) { 
    const {} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {value,name,type,execute} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}

async function createPeriod(req, res) { 
    const {id, registration_start, cycle_init, cycle_end} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function getPeriods(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const data = [
        {
            id: 20232, 
            registration_start: "2023/09/21",
            cycle_init: "2023/09/21", 
            cycle_end: "2023/09/21",
        },
        {
            id: 20231, 
            registration_start: "2023/09/21",
            cycle_init: "2023/09/21", 
            cycle_end: "2023/09/21",
        },
    ]

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    getLocations,
    getLanguage,
    getEmailsSystem,
    updateEmailsSystem,
    setMyLenguage,
    updateMyLenguage,
    setMyCertificate,
    updateMyCertificate,
    deleteMyCertificate,
    deleteMyLenguage,
    getSectors,
    maintenanceSysData,
    createPeriod,
    getPeriods
}