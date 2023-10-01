const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');
const { nowTime, getDateByNumber, matchBetween, getAttrById, getTimeDate } = require('../utils/general-functions');
const { getState } = require('./agreement');

async function studentData(req, res) { 
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    const {idUser} = req.params;

    let success = false
    let message = "Error en el servicio de estudiante";

    const user = {
        experience: [],
        certificates: [],
        agreements: [],
        ads: [],
        opinions: []
    }

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM certificate WHERE id_user=${idUser} AND active=1;`
        let result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const keyName = it.type===1? 'experience': 'certificates';
            const item = {
                ...it,
                date_init: getDateByNumber(it.date_init),
                date_end: getDateByNumber(it.date_end),
                id: `${it.id_certificate}`,
            }
            user[keyName].push(item)
        }

        sqlQuery = `SELECT A.id_agreement, U.name, J.title, J.id_job, U.photo, U.id_user, J.modality,
        A.document_path, J.salary,J.job_start,J.job_end,U.id_location,A.observation_date_st, A.id_student,
        A.observation_student, A.observation_ie, A.id_employed,A.id_enterprise,A.id_signatory,
        A.observation_date_ie, A.date_student, A.date_enterprise, A.date_professor FROM agreement AS A
        INNER JOIN job AS J ON A.id_job = J.id_job
        INNER JOIN user AS U ON U.id_user = A.id_enterprise
        WHERE A.id_student=${idUser};`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const {value,name} = getState(it,"STUDENT")

            const item = {
                job_title: it.title,
                enterprise_name: it.name,
                id: it.id_agreement,
                state: name,
                state_id: value,
            }
            user.agreements.push(item)
        }

        sqlQuery = `SELECT * FROM studentxjob WHERE id_student=${idUser} AND active=1 AND relation='P';`
        result =  await sqlAsync(sqlQuery, connection);
        for(let it of result) {
            const sqlj = `SELECT * FROM job WHERE id_job=${it.id_job};`
            const j =  await sqlAsync(sqlj, connection);
            const job = j[0];
            const sqlu = `SELECT * FROM user WHERE id_user=${job.id_enterprise};`
            const u =  await sqlAsync(sqlu, connection);
            const us = u[0];

            const item = {
                job_title: job.title,
                enterprise_name: us.name,
                date_end: job.end_ad_date,
                code: `${job.id_job}`
            }
            if(item.date_end > nowTime()) user.ads.push(item)
        }

        sqlQuery = `SELECT * FROM opinion WHERE id_creator=${idUser} AND active=1;`
        result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const item = {
                id: it.id_opinion,
                enterprise_name: it.enterprise,
                score: it.score,
                date_update: getDateByNumber(it.update_date),
                description: it.descripcion,
                student: it.student
            }
            user.opinions.push(item)
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

async function getStudents(req, res) { 
    const {student,location,languages,specialty,oderby,type,code} = req.body
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de estudiantes";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT U.name, U.lastname, S.cycle, U.photo, U.id_user, S.cv_update, S.cv_path, J.relation,S.id_specialty
        FROM studentxjob AS J
        INNER JOIN student AS S ON S.id_user = J.id_student
        INNER JOIN user AS U ON U.id_user = S.id_user
        WHERE CONCAT(U.name, ' ', U.lastname) like '%${student}%' AND J.id_job=${code}`;
        if(location!='') sqlQuery += ` AND U.id_location =${location}`
        if(specialty!='') sqlQuery += ` AND S.id_specialty =${specialty}`
        if(type!='' && type!='1') sqlQuery += ` AND J.relation ='${type}'`
        if(oderby!='') sqlQuery += ` ORDER BY ${oderby=="1"? "S.cv_update": "S.cycle"}`
        
        const result = await sqlAsync(sqlQuery, connection);
        
        const sqlSpe = `SELECT * FROM specialty;`;
        const arrSpecialties = await sqlAsync(sqlSpe, connection);

        for(let it of result) {
            const sqllans = `SELECT * FROM userxlanguage AS X
            INNER JOIN language AS L ON X.id_language=L.id_language
            WHERE X.id_user=${it.id_user} AND X.active=1;`;
            const arrlans = await sqlAsync(sqllans, connection);

            if(languages.length===0 || matchBetween(arrlans, languages, 'id_language')) {
                const item = {
                    name: `${it.name} ${it.lastname}`,
                    specialty: getAttrById(arrSpecialties,'id_specialty',it.id_specialty, 'name'),//
                    cycle: it.cycle,
                    photo: it.photo,
                    id: `${it.id_user}`,
                    cv_update: getDateByNumber(it.cv_update),
                    cv_path: it.cv_path,
                    hired: it.relation=='C',
                    languages: []
                } 
                for(let lan of arrlans) {
                    const lang = {
                        value: `${lan.id_language}`,
                        name: lan.name,
                        level: lan.level
                    }
                    item.languages.push(lang)
                }
                data.push(item)
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

async function contractStudent(req, res) { 
    const {name, id_student,id_enterprise, code,init_date,end_date} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de contratación";

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `INSERT INTO agreement(name,document_path,id_job,id_student,id_enterprise,id_employed,id_signatory,
            hash,date_student,date_enterprise,date_professor,init_date,end_date,observation_student,observation_ie,
            observation_date_st,observation_date_ie,active) 
        values('${name}','',${code},${id_student},${id_enterprise},null,null,
        '',0,0,0,${getTimeDate(init_date)},${getTimeDate(end_date)},'','',
        0,0,1);`;
        let result =  await sqlAsync(sqlQuery, connection);

        if (result.affectedRows) {
            sqlQuery = `UPDATE studentxjob SET relation='C' WHERE id_student=${id_student} AND id_job=${code} AND active=1`;
            let r =  await sqlAsync(sqlQuery, connection);

            if (r.affectedRows) success = true
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
    studentData,
    getStudents,
    contractStudent
}