const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');
const { getAttrById, getDateByNumber, nowTime, getTimeDate } = require('../utils/general-functions');
const { getScore } = require('./enterprise');

async function getAgreements(req, res) { 
    const {job,enterprise,student,employed,location,modality,iam,
        salary_min,salary_max,state,date_end,date_init,myId} = req.body;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de estudiantes";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        const sqlSpe = `SELECT * FROM location;`;
        const arrLocations = await sqlAsync(sqlSpe, connection);
        const searchCode = job!='' && !isNaN(job)? ` OR J.id_job = ${Number(job)}`: '';
        let sqlQuery = ''

        //enterprise
        if(iam==='ENTERPRISE') {
            sqlQuery = `SELECT A.id_agreement, U.name, U.lastname, J.title, J.id_job, U.photo, U.id_user, 
            A.document_path, J.salary,J.job_start,J.job_end,U.id_location,A.observation_date_st,
            A.observation_date_ie, A.date_student, A.date_enterprise, A.date_professor FROM agreement AS A
            INNER JOIN job AS J ON A.id_job = J.id_job
            INNER JOIN user AS U ON U.id_user = A.id_student
            WHERE (J.title like '%${job}%' ${searchCode}) AND A.id_enterprise=${myId} AND CONCAT(U.name, ' ', U.lastname) like '%${student}%'
            AND J.modality like '%${modality}%' 
            AND J.salary > ${salary_min && salary_min!=''? salary_min: 0} AND J.salary < ${salary_max && salary_max!=''? salary_max: 9999999} 
            AND J.job_start > ${date_init && date_init!=''? getTimeDate(date_init): 0}`;
        }
        //student
        else if(iam==='STUDENT') {
            sqlQuery = `SELECT A.id_agreement, U.name, J.title, J.id_job, U.photo, U.id_user, 
            A.document_path, J.salary,J.job_start,J.job_end,U.id_location,A.observation_date_st,
            A.observation_date_ie, A.date_student, A.date_enterprise, A.date_professor FROM agreement AS A
            INNER JOIN job AS J ON A.id_job = J.id_job
            INNER JOIN user AS U ON U.id_user = A.id_enterprise
            WHERE (J.title like '%${job}%' ${searchCode}) AND A.id_student=${myId} AND U.name like '%${enterprise}%'
            AND J.modality like '%${modality}%' 
            AND J.salary > ${salary_min && salary_min!=''? salary_min: 0} AND J.salary < ${salary_max && salary_max!=''? salary_max: 9999999} 
            AND J.job_start > ${date_init && date_init!=''? getTimeDate(date_init): 0}`;
        }
        //signatory
        else if(iam==='SIGNATORY') {
            sqlQuery = `SELECT A.id_agreement, U.name, U.lastname, J.title, J.id_job, U.photo, U.id_user, E.name AS enterprise_name,
            A.document_path, J.salary,J.job_start,J.job_end,U.id_location,A.observation_date_st,
            A.observation_date_ie, A.date_student, A.date_enterprise, A.date_professor FROM agreement AS A
            INNER JOIN job AS J ON A.id_job = J.id_job
            INNER JOIN user AS U ON U.id_user = A.id_student
            INNER JOIN user AS E ON E.id_user = A.id_enterprise
            WHERE (J.title like '%${job}%' ${searchCode}) AND E.name like '%${enterprise}%' AND CONCAT(U.name, ' ', U.lastname) like '%${student}%'
            AND J.modality like '%${modality}%' 
            AND J.salary > ${salary_min && salary_min!=''? salary_min: 0} AND J.salary < ${salary_max && salary_max!=''? salary_max: 9999999} 
            AND J.job_start > ${date_init && date_init!=''? getTimeDate(date_init): 0}`;
        }
        if(date_end && date_end!='') sqlQuery += ` AND J.job_end < ${getTimeDate(date_end)}`;
        
        const result = await sqlAsync(sqlQuery, connection);
        console.log(result)
        for(let it of result) {
            const {value,name} = getState(it,iam)
            let agName = `${it.name} `
            if(iam!=='STUDENT') agName+=it.lastname
            const item = {
                job_title: it.title,
                user_name: agName,
                code: `${it.id_job}`,
                salary: it.salary,
                job_start: getDateByNumber(it.job_start),
                job_end: getDateByNumber(it.job_end),
                location: getAttrById(arrLocations,'id_location',it.id_location, 'name'),
                state: name,
                state_id: Number(value),
                user_id: `${it.id_user}`,
                doc_path: it.document_path,
                user_photo: it.photo,
                enterprise_name: it.enterprise_name,
                id_agreement: it.id_agreement,
            }
            
            if(state && state!='' && state==value) data.push(item)
            else if(!state || state=='') data.push(item)
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

async function getAgreementState(req, res) { 
    const {code,iam} = req.params;
    
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de estudiantes";

    let data = null

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        const sqlSpe = `SELECT * FROM location;`;
        const arrLocations = await sqlAsync(sqlSpe, connection);
        const sqlsec = `SELECT * FROM sector;`;
        const arrSectors = await sqlAsync(sqlsec, connection);

        let sqlQuery = `SELECT A.id_agreement, U.name, J.title, J.id_job, U.photo, U.id_user, J.modality,
            A.document_path, J.salary,J.job_start,J.job_end,U.id_location,A.observation_date_st, A.id_student,
            A.observation_student, A.observation_ie, A.id_employed,A.id_enterprise,A.id_signatory,
            A.observation_date_ie, A.date_student, A.date_enterprise, A.date_professor FROM agreement AS A
            INNER JOIN job AS J ON A.id_job = J.id_job
            INNER JOIN user AS U ON U.id_user = A.id_enterprise
            WHERE A.id_agreement=${code};`;
 
        const result = await sqlAsync(sqlQuery, connection);

        if(result.length>0) {
            const it = result[0]
            const {value,name} = getState(it,iam)
            
            const sqlStu = `SELECT * FROM user WHERE id_user=${it.id_student};`;
            const arrst = await sqlAsync(sqlStu, connection);
            const student = arrst[0]

            const sqleee = `SELECT * FROM enterprise WHERE id_user=${it.id_enterprise};`;
            const arreee = await sqlAsync(sqleee, connection);
            const eee = arreee[0]

            const {score,num_opinios} = await getScore(it.id_user,connection);

            const item = {
                job_title: it.title,
                enterprise_name: it.name,
                code: `${it.id_job}`,
                salary: it.salary,
                modality: it.modality,
                enterprise_location: getAttrById(arrLocations,'id_location',it.id_location, 'name'),
                state: name,
                state_id: Number(value),
                enterprise_id: `${it.id_user}`,
                doc_path: it.document_path,
                enterprise_photo: it.photo,
                id_agreement: it.id_agreement,
                student_name: `${student.name} ${student.lastname}`,
                student_photo: student.photo,
                student_id: `${student.id_user}`,
                observation_student: it.observation_student,
                observation_ie: it.observation_ie,
                observation_date_st: getDateByNumber(it.observation_date_st),
                observation_date_ie: getDateByNumber(it.observation_date_ie),
                enterprise_score: score, 
                enterprise_opinios: num_opinios, 
                enterprise_sector: getAttrById(arrSectors,'id_sector',eee.id_sector, 'name'),
                list: []
            }
            if(it.date_student && it.date_student!='' && it.date_student!=0) {
                const ip ={
                    id: `${student.id_user}`,
                    photo: student.photo,
                    name: `${student.name} ${student.lastname}`,
                    role: 'STUDENT',
                    date: getDateByNumber(it.date_student),
                    attr: "Estudiante",
                }
                item.list.push(ip)
            }
            if(it.date_enterprise && it.date_enterprise!='' && it.date_enterprise!=0 && it.id_employed) {
                const sqlStu = `SELECT * FROM user WHERE id_user=${it.id_employed};`;
                const arrst = await sqlAsync(sqlStu, connection);
                const employed = arrst[0]
                
                const ip ={
                    id: `${employed.id_user}`,
                    photo: employed.photo,
                    name: `${employed.name} ${employed.lastname}`,
                    role: 'EMPLOYED',
                    date: getDateByNumber(it.date_enterprise),
                    attr: "Empresa",
                }
                item.list.push(ip)
            }
            if(it.date_professor && it.date_professor!='' && it.date_professor!=0 && it.id_signatory) {
                const sqlStu = `SELECT * FROM user WHERE id_user=${it.id_signatory};`;
                const arrst = await sqlAsync(sqlStu, connection);
                const signatory = arrst[0]
                
                const ip ={
                    id: `${signatory.id_user}`,
                    photo: signatory.photo,
                    name: `${signatory.name} ${signatory.lastname}`,
                    role: 'SIGNATORY',
                    date: getDateByNumber(it.date_professor),
                    attr: "Institución Educativa",
                }
                item.list.push(ip)
            }
            console.log(item)
            data = item
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

const agreementStatesType = [
    {
        value: '',
        name: 'Todos',
    },
    {
        value: '1',
        name: 'Vigente',
    },
    {
        value: '2',
        name: 'Vencido',
    },
    {
        value: '3',
        name: 'Falta firmar',
    },
    {
        value: '4',
        name: 'En espera de firmas',
    },
    {
        value: '5',
        name: 'Falta subir convenio',
    },
    {
        value: '6',
        name: 'Observado',
    },
    {
        value: '7',
        name: 'Periodo no iniciado',
    },
]
function getState(it,iam) {
    if(!it.document_path || it.document_path=='') return agreementStatesType[5]
    if(it.observation_date_st==0 || it.observation_date_ie==0) return agreementStatesType[6]

    if(iam==="STUDENT" && (!it.date_student || it.date_student=='' || it.date_student==0)) return agreementStatesType[3]
    if(iam==="ENTERPRISE" && (!it.date_enterprise || it.date_enterprise=='' || it.date_enterprise==0)) return agreementStatesType[3]
    if(iam==="SIGNATORY" && (!it.date_professor || it.date_professor=='' || it.date_professor==0)) return agreementStatesType[3]
    
    if((!it.date_student || it.date_student=='' || it.date_student==0) || 
    (!it.date_enterprise || it.date_enterprise=='' || it.date_enterprise==0) ||
    (!it.date_professor || it.date_professor=='' || it.date_professor==0) ) return agreementStatesType[4]

    if(it.job_start > nowTime()) return agreementStatesType[7]
    if(it.job_start < nowTime() && it.job_end > nowTime()) return agreementStatesType[1]
    if(it.job_end < nowTime()) return agreementStatesType[2]

    return agreementStatesType[0]
}

module.exports = {
    getAgreements,
    getAgreementState
}