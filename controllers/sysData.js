const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getLocations(req, res) { 

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
async function getEmailsSystem(req, res) { 

    const data = {
        support: "soporte@pucp.edu.pe",
        domain: "pucp.edu.pe",
    }

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
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function setMyCertificate(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = {success: true, id: '1232222'}

    res.status(200).send(data);

    // connection.end();

}
async function updateMyCertificate(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}
async function deleteMyCertificate(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send(data);

    // connection.end();

}


module.exports = {
    getLocations,
    getLanguage,
    getEmailsSystem,
    setMyLenguage,
    updateMyLenguage,
    setMyCertificate,
    updateMyCertificate,
    deleteMyCertificate,
    deleteMyLenguage
}