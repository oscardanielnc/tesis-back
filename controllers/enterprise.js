const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');
const { nowTime } = require('../utils/general-functions');

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

        sqlQuery = `SELECT * FROM opinion WHERE id_enterprise=${idUser} AND active=1;`
        result =  await sqlAsync(sqlQuery, connection);

        let index = 0
        for(let i=0; i<result.length && index<10; i++) {
            const it = result[i]
            const item = {
                id: it.id_opinion,
                enterprise_name: it.enterprise,
                score: it.score,
                date_update: getDateByNumber(it.update_date),
                description: it.descripcion,
                student: it.student,
                student_id: `${it.id_creator}`,
                id_enterprise: `${idUser}`,
            }
            user.opinions.push(item)
            index++
        }
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
async function getEnterprises(req, res) { 
    const {value} = req.body;

    const data = [
        {
            id: '1',
            name: 'IBM del Peru',
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            ruc: '2030405060',
            update_date: '08/08/2023',
            active: true
        },
        {
            id: '2',
            name: 'IBM del Peru',
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            ruc: '2030405060',
            update_date: '08/08/2023',
            active: true
        },
        {
            id: '3',
            name: 'IBM del Peru',
            photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
            ruc: '2030405060',
            update_date: '08/08/2023',
            active: true
        },
    ]

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}

async function updateEnterprise(req, res) { 
    const {id, active} = req.body;

    const data = true

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}

async function getScore(id_enterprise,connection) {
    // const sqlQueryOp = `SELECT * FROM opinion WHERE id_enterprise=${id_enterprise};`
    // const resultOp  = await sqlAsync(sqlQueryOp, connection);

    return {
        score: 0,
        num_opinios: 0
    }
}


module.exports = {
    enterpriseData,
    enterpriseExist,
    getEnterprises,
    updateEnterprise,
    getScore
}