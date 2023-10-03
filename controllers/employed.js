const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");;
const { sqlAsync } = require('../utils/async');
const { getDateByNumber, nowTime } = require('../utils/general-functions');
const { MAIN_PAGE, mailFormater } = require('../utils/const');
const { sendEmail } = require('../utils/sendEmail');

async function employedData(req, res) { 
    const {idUser,enterprise_id} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de estudiante";

    const user = {
        ads: [],
        agreements: []
    }

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM job WHERE id_enterprise=${enterprise_id} AND active=1 ORDER BY end_ad_date;`
        let result =  await sqlAsync(sqlQuery, connection);
        let sqlen = `SELECT * FROM user WHERE id_user=${enterprise_id};`
        let entresult =  await sqlAsync(sqlen, connection);
        const enterp = entresult.length>0? entresult[0]: {name: '(Empresa desconocida)', photo: ''}

        let index=0;
        for(let i=0; i<result.length && index<5;i++) {
            const it = result[i]
            const sql = `SELECT * FROM benefit WHERE id_job=${it.id_job} AND active=1;`
            const r =  await sqlAsync(sql, connection);
            let desc = '';
            if(r.length>0) desc = r[0].descripcion;

            const item = {
                job_title: it.title,
                enterprise_name: enterp.name,
                enterprise_photo: enterp.photo,
                date_end: getDateByNumber(it.end_ad_date),
                code: `${it.id_job}`,
                enterprise_id: enterprise_id,
                description: desc.substring(0,80)
            }
            if(it.end_ad_date > nowTime()) user.ads.push(item)
            index++
        }

        sqlQuery = `SELECT * FROM agreement WHERE id_employed=${idUser} AND active=1 AND hash<>'';`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sqlj = `SELECT * FROM job WHERE id_job=${it.id_job};`
            const j =  await sqlAsync(sqlj, connection);
            const job = j[0];

            const item = {
                job_title: job.title,
                id: it.id_agreement,
                document_path: it.document_path,
                date_sign: getDateByNumber(it.date_enterprise), 
            }
            user.agreements.push(item)
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
async function getEmployees(req, res) { 
    const {name,job,reader,signatory,recruiter,flag} = req.body;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empleados";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT U.id_user, U.name, U.lastname, U.photo, U.update_state, E.job, 
        E.reader, E.signatory, E.recruiter FROM user AS U INNER JOIN employed AS E 
        ON U.id_user = E.id_user WHERE CONCAT(U.name, ' ', U.lastname) like '%${name}%' AND E.job like '%${job}%'`;
        if(reader) sqlQuery += ` AND E.reader=${flag?1:0}`;
        if(signatory) sqlQuery += ` AND E.signatory=${flag?1:0}`;
        if(recruiter) sqlQuery += ` AND E.recruiter=${flag?1:0}`;

        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const item = {
                name: `${it.name} ${it.lastname}`,
                job: it.job,
                date_update: getDateByNumber(it.update_state),
                user_id: it.id_user,
                reader: it.reader==1,
                signatory: it.signatory==1,
                recruiter: it.recruiter==1,
                user_photo: it.photo,
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
async function changePrivToEmployed(req, res) { 
    const {user_id,reader,signatory,recruiter} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empleados";

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `UPDATE employed SET reader=${reader?1:0},signatory=${signatory?1:0},
        recruiter=${recruiter?1:0} WHERE id_user=${user_id}`;
        const result =  await sqlAsync(sqlQuery, connection);

        if (result.affectedRows) {
            let sql = `UPDATE user SET update_state=${nowTime()} WHERE id_user=${user_id}`;
            const r =  await sqlAsync(sql, connection);

            if (r.affectedRows) {
                success = true
                let sqlmail = `SELECT * FROM user WHERE id_user=${user_id}`
                const resultMail =  await sqlAsync(sqlmail, connection);
                const employed = resultMail[0]
                const subject = `Actualización de privilegios`
                const arr = [`A nombre de su empresa le informamos que se han actualizado sus privilegios en la plataforma.`,
                            `Puede consultar dichos privilegios ingresando a ${MAIN_PAGE}.`]
                const text = mailFormater(`${employed.name} ${employed.lastname}`,arr)
                await sendEmail(employed.email, subject, text)
            }
        }
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: success, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();
}


module.exports = {
    employedData,
    getEmployees,
    changePrivToEmployed
}