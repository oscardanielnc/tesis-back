const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');
const { nowTime, getDateByNumber } = require('../utils/general-functions');

async function addSignatory(req, res) {
    const {name, last_name, email, role} = req.body;
    let success = false;
    let message = "Error en el servicio de evaluadores y firmantes"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `INSERT INTO user(role,name,lastname,email,photo,id_location,
            description,background,birstdate,update_state,sign,active) 
            values('${role}','${name}','${last_name}','${email}','',null,
            '','',0,${nowTime()},'',1);`
        const resultType  = await sqlAsync(sqlQueryType, connection);
        
        if(resultType.affectedRows) success = true

    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }

    const n = success? 200: 500;
    res.status(n).send({result: success, success, message});

    connection.end();
}
async function updateSignatory(req, res) {

    const {id, active} = req.body;

    let success = false;
    let message = "Error en el servicio de empresas"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `UPDATE user SET active=${active?1:0}, update_state=${nowTime()} WHERE id_user=${id};`
        const resultType  = await sqlAsync(sqlQueryType, connection);
        
        if(resultType.affectedRows) success = true

    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }

    const n = success? 200: 500;
    res.status(n).send({result: success, success, message});

    connection.end();
}
async function getSignatories(req, res) {
    const {value} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empresas";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT * FROM user WHERE CONCAT(name, ' ', lastname) like '%${value}%' 
        AND (role='SIGNATORY' OR role='EVALUATOR');`;
        
        const result = await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            
            const item = {
                id: `${it.id_user}`,
                name: it.name,
                last_name: it.lastname,
                photo: it.photo,
                email: it.email,
                role: it.role,
                update_date: getDateByNumber(it.update_state),
                active: it.active==1
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


module.exports = {
    addSignatory,
    getSignatories,
    updateSignatory
}