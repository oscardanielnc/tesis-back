const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');
const { nowTime, getDateByNumber, getAttrById } = require('../utils/general-functions');

async function enterpriseData(req, res) { 
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    const {idUser} = req.params;

    let success = false
    let message = "Error en el servicio de estudiante";

    const user = {
        ads: [],
        opinions: []
    }

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM job WHERE id_enterprise=${idUser} AND active=1 ORDER BY end_ad_date;`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sql = `SELECT * FROM benefit WHERE id_job=${it.id_job} AND active=1;`
            const r =  await sqlAsync(sql, connection);
            let desc = '';
            if(r.length>0) desc = r[0].descripcion;

            const item = {
                job_title: it.title,
                enterprise_name: '',
                date_end: it.end_ad_date,
                code: `${it.id_job}`,
                description: desc.substring(0,60)
            }
            if(item.date_end > nowTime()) user.ads.push(item)
        }

        // sqlQuery = `SELECT * FROM opinion WHERE id_enterprise=${idUser} AND active=1;`
        // result =  await sqlAsync(sqlQuery, connection);

        // let index = 0
        // for(let i=0; i<result.length && index<10; i++) {
        //     const it = result[i]
        //     const item = {
        //         id: it.id_opinion,
        //         enterprise_name: it.enterprise,
        //         score: it.score,
        //         date_update: getDateByNumber(it.update_date),
        //         description: it.descripcion,
        //         student: it.student,
        //         student_id: `${it.id_creator}`,
        //         id_enterprise: `${idUser}`,
        //         state: it.verification_state
        //     }
        //     user.opinions.push(item)
        //     index++
        // }
        success = true
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: user, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();
}
async function enterpriseExist(req, res) { 
    const {ruc} = req.params;

    let result = {
        exist: false,
        id: '',
        ruc: '',
        name: '',
        photo: ''
    }
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT U.id_user, U.name, U.photo, E.ruc
                    FROM user AS U INNER JOIN enterprise AS E on U.id_user = E.id_user WHERE E.ruc='${ruc}' AND U.active=1;`;
        const resultq =  await sqlAsync(sqlQuery, connection);

        if(resultq.length>0) {
            const emp = resultq[0];
            result = {
                exist: true,
                ruc: emp.ruc,
                id: emp.id_user,
                name: emp.name,
                photo: emp.photo,
            }
        }
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }
    
    res.status(200).send({result: result, success: true, message: ""});
    connection.end();

}
async function getAlredySigned(req, res) { 
    const {idEnterprise, idUser} = req.params;

    let result = false
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM opinion WHERE id_creator=${idUser} AND id_enterprise=${idEnterprise} AND active=1;`;
        const resultq =  await sqlAsync(sqlQuery, connection);
        let sqlQuery2 = `SELECT * FROM studentxjob WHERE id_student=${idUser} AND id_enterprise=${idEnterprise} AND active=1 AND relation='C';`;
        const resultq2 =  await sqlAsync(sqlQuery2, connection);

        result = resultq.length===0 && resultq2.length>0
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }
    
    res.status(200).send({result: result, success: true, message: ""});
    connection.end();

}
async function getEnterprises(req, res) { 
    const {value} = req.body;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empresas";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT U.name, U.photo, U.id_user, E.ruc, U.update_state, U.active
            FROM enterprise AS E
            INNER JOIN user AS U ON U.id_user = E.id_user
            WHERE U.name like '%${value}%' OR E.ruc like '%${value}%';`;
        
        const result = await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            
            const item = {
                id: `${it.id_user}`,
                name: it.name,
                photo: it.photo,
                ruc: it.ruc,
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

async function getEnterprisesBL(req, res) { 
    const {name,state} = req.body;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empresas";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT U.name, U.photo, U.id_user, E.ruc, E.blacklisted_state
            FROM enterprise AS E
            INNER JOIN user AS U ON U.id_user = E.id_user
            WHERE (U.name like '%${name}%' OR E.ruc like '%${name}%') AND U.active=1 AND E.blacklisted_state like '%${state}%';`;
        
        const result = await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const {score,num_opinios} = await getScore(it.id_user,connection);
            const item = {
                id: `${it.id_user}`,
                name: it.name,
                photo: it.photo,
                ruc: it.ruc,
                state: it.blacklisted_state,
                score,
                num_opinios
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

async function getEnterpriseBlackList(req, res) { 
    const {id} = req.params;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empresas";

    let data = {}

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT U.name, U.photo, U.id_user, E.ruc, E.blacklisted_state
            FROM enterprise AS E
            INNER JOIN user AS U ON U.id_user = E.id_user
            WHERE U.id_user = ${id}`;
        
        const result = await sqlAsync(sqlQuery, connection);
        const enterp = result[0]
        const {score,num_opinios} = await getScore(enterp.id_user,connection);

        const enterprise = {
            id: enterp.id_user,
            photo: enterp.photo,
            name: enterp.name,
            state: enterp.blacklisted_state,
            score,
            num_opinios
        }

        sqlQuery = `SELECT * FROM blacklist_msg WHERE id_enterprise = ${id} AND active=1 ORDER BY id_blacklist_msg DESC`;
        const comments = await sqlAsync(sqlQuery, connection);
        data = {
            enterprise,
            comments
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
async function updateEnterprise(req, res) { 
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
async function getScore(id_enterprise,connection) {
    let data = {
        score: 0,
        num_opinios: 0
    }
    try{
        let sqlQuery = `SELECT COUNT(*) AS num_opinios, SUM(score) AS sumscore FROM opinion WHERE id_enterprise=${id_enterprise} AND student_date<>0;`;
        const result = await sqlAsync(sqlQuery, connection);
        if(result.length>0) {
            const res = result[0]
            const dec = res.sumscore/(res.num_opinios*8)
            const dec100 = Math.floor(dec*100)
            data = {
                score: dec100/100,
                num_opinios: res.num_opinios
            }
        }
    } catch(e){
        console.log(e)
    }

    return data
}
async function getEnterpriseOpinion(req, res) { 
    const {id} = req.params;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empresas";

    let data = null

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        const sqlSpe = `SELECT * FROM location;`;
        const arrLocations = await sqlAsync(sqlSpe, connection);
        const sqlsec = `SELECT * FROM sector;`;
        const arrSectors = await sqlAsync(sqlsec, connection);
    
        let sqlQuery = `SELECT U.name, U.photo, U.id_user, E.ruc, U.id_location, E.num_employees, E.id_sector
            FROM enterprise AS E
            INNER JOIN user AS U ON U.id_user = E.id_user
            WHERE U.id_user=${id};`;
        
        const result = await sqlAsync(sqlQuery, connection);
        
        if(result.length > 0) {
            const it = result[0]
            const {score,num_opinios} = await getScore(it.id_user,connection);
            data = {
                enterprise_name: it.name,
                enterprise_score: score,
                enterprise_photo: it.photo,
                enterprise_sector: getAttrById(arrSectors,'id_sector',it.id_location, 'name'),
                enterprise_location: getAttrById(arrLocations,'id_location',it.id_sector, 'name'),
                num_employees: it.num_employees,
                enterprise_id: `${it.id_user}`,
                ruc: it.ruc,
                num_opinios
            }
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

async function getEnterprisesOpinions(req, res) { 
    const {name, sector, location, orderBy} = req.body;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empresas";

    let data = []
    let preData = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        const sqlSpe = `SELECT * FROM location;`;
        const arrLocations = await sqlAsync(sqlSpe, connection);
        const sqlsec = `SELECT * FROM sector;`;
        const arrSectors = await sqlAsync(sqlsec, connection);
    
        let sqlQuery = `SELECT U.name, U.photo, U.id_user, E.ruc, U.id_location, E.num_employees, E.id_sector
            FROM enterprise AS E
            INNER JOIN user AS U ON U.id_user = E.id_user
            WHERE U.name like '%${name}%' `;
        if(sector && sector!='') sqlQuery += ` AND E.id_sector=${sector} `;
        if(location && location!='') sqlQuery += ` AND U.id_location=${location};`;
        
        const result = await sqlAsync(sqlQuery, connection);
        
        for(let it of result) {
            const {score,num_opinios} = await getScore(it.id_user,connection);
            const item = {
                enterprise_name: it.name,
                enterprise_score: score,
                enterprise_photo: it.photo,
                enterprise_sector: getAttrById(arrSectors,'id_sector',it.id_location, 'name'),
                enterprise_location: getAttrById(arrLocations,'id_location',it.id_sector, 'name'),
                num_employees: it.num_employees,
                enterprise_id: `${it.id_user}`,
                ruc: it.ruc,
                num_opinios
            }
            preData.push(item)
        }
        data = orderArrEops(preData, orderBy)
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

function orderArrEops(preData, orderBy) {
    if(!orderBy || orderBy=='') return preData;
    const attr = orderBy==='vp'? 'enterprise_score': 'num_opinios'

    preData.sort(function(a,b) {
        const v1 = a[attr]
        const v2 = b[attr]
        return v2 - v1
    })
    return preData
}

module.exports = {
    enterpriseData,
    enterpriseExist,
    getEnterprises,
    getEnterprisesBL,
    updateEnterprise,
    getScore,
    getEnterpriseOpinion,
    getEnterprisesOpinions,
    getAlredySigned,
    getEnterpriseBlackList
}