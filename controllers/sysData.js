const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function getLocations(req, res) {
    const {name} = req.body;
    const data = []
    let success = false
    let message = "Error en el servicio de ubicaciones"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM location WHERE name like '%${name}%' AND active=1;`
        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const item = {
                ...it,
                value: `${it.id_location}`,
                active: it.active==1,
            }
            data.push(item)
        }
        success = true
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: data, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();

}
async function getLanguage(req, res) { 
    const {name} = req.body;
    const data = []
    let success = false
    let message = "Error en el servicio de ubicaciones"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM language WHERE name like '%${name}%' AND active=1;`
        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const item = {
                ...it,
                value: `${it.id_language}`,
                active: it.active==1,
            }
            data.push(item)
        }
        success = true
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: data, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();

}
async function getSectors(req, res) { 
    const {name} = req.body;
    const data = []
    let success = false
    let message = "Error en el servicio de ubicaciones"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM sector WHERE name like '%${name}%' AND active=1;`
        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const item = {
                ...it,
                value: `${it.id_sector}`,
                active: it.active==1,
            }
            data.push(item)
        }
        success = true
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: data, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();

}
async function getEmailsSystem(req, res) { 

    const data = {
        support: "soporte@pucp.edu.pe",
        domain: "pucp.edu.pe",
    }

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function updateEmailsSystem(req, res) { 
    const {support,domain} = req.body;
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function setMyLenguage(req, res) { 
    // Relacionar un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function updateMyLenguage(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function deleteMyLenguage(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {userId, lanId} = req.body
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function setMyCertificate(req, res) { 
    const {title,enterprise_name,icon,date_init,date_end,description,enterprise_id,enterprise_photo,ruc,type} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = {success: true, id: '1232222'}

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function updateMyCertificate(req, res) { 
    const {id,title,enterprise_name,icon,date_init,date_end,description,enterprise_id,enterprise_photo,ruc} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {idUser, idLanguage, level} = req.body
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function deleteMyCertificate(req, res) { 
    // Actualizar la relacion de un lenguaje existente con un perfil
    const {id} = req.body
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}
async function maintenanceSysData(req, res) { 
    const {value,name,type,execute} = req.body
    //delete, edit, add
    //'lan','loc', 'sec'
    let result = false;
    let error = "Error en el servicio de mantenimiento"

    let typeQ = "location";
    if(type==='lan') typeQ = "language";
    if(type==='sec') typeQ = "sector";

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        let sqlQuery = `UPDATE ${typeQ} SET active=0 WHERE id_${typeQ}=${value};`
        if(execute==='delete') {
            // let sqlSelct = `SELECT * FROM user WHERE id_location=${value};`//location
            // if(type==='lan') sqlSelct = `SELECT * FROM userxlanguage WHERE id_language=${value};`//language
            // else if (type==='sec') sqlSelct = `SELECT * FROM enterprise WHERE id_sector=${value};`//sector

            // const resultSlct  = await sqlAsync(sqlSelct, connection);
            // if(resultSlct.length>0) {
            //     error === "No se puede eliminar este elemento debido a la existencia de relaciones"
            // } else {
                const resultQ = await sqlAsync(sqlQuery, connection);

                if(resultQ.affectedRows) {
                    result = true
                }
            // }

        } else if(execute==='edit') {
            sqlQuery = `UPDATE ${typeQ} SET name='${name}' WHERE id_${typeQ}=${value};`
            const resultSlct  = await sqlAsync(sqlQuery, connection);

            if(!resultSlct.affectedRows) {
                error === "Ocurrió un error al actualizar el elemento"
            } else result = true;
        } else if(execute==='add') {
            sqlQuery = `INSERT INTO ${typeQ}(name,active) values('${name}',1);`
            const resultSlct  = await sqlAsync(sqlQuery, connection);

            if(!resultSlct.affectedRows) {
                error === "Ocurrió un error al insertar el elemento"
            } else result = true;
        }
    } catch (e) {
        console.log(e)
        error = e.message
    }
    if(result) {
        res.status(200).send({result: result, success: result, message: error});
    } else {
        res.status(505).send({ 
            message: error,
            success: result
        })
    }
    connection.end();

}

async function createPeriod(req, res) { 
    const {id, registration_start, cycle_init, cycle_end} = req.body;
    // Actualizar la relacion de un lenguaje existente con un perfil
    const data = true

    res.status(200).send({result: data, success: true, message: ""});

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

    res.status(200).send({result: data, success: true, message: ""});

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