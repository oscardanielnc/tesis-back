const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');
const { getTimeDate, getDateByNumber } = require('../utils/general-functions');
const { getUser } = require('./auth');

async function getJobs(req, res) { 

    const {job,enterprise,location,languages,modality,sector,enterprise_id,
        salary_min,salary_max,date_init,date_end,iamEnterprise} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de trabajos";

    const searchCode = job!='' && !isNaN(job)? ` OR J.id_job = ${Number(job)}`: '';

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `SELECT J.title, U.name, J.end_ad_date, J.id_job, J.salary, U.id_location, J.modality, E.id_user, U.photo
        FROM job AS J
        INNER JOIN enterprise AS E ON E.id_user = J.id_enterprise
        INNER JOIN user AS U ON U.id_user = E.id_user
        WHERE (J.title like '%${job}%' ${searchCode}) AND J.modality like '%${modality}%' 
        AND J.salary > ${salary_min && salary_min!=''? salary_min: 0} AND J.salary < ${salary_max && salary_max!=''? salary_max: 9999999} 
        AND J.end_ad_date > ${date_init && date_init!=''? getTimeDate(date_init): 0}`;
        if(date_end && date_end!='') sqlQuery += ` AND J.end_ad_date < ${getTimeDate(date_end)}`
        if(iamEnterprise && enterprise_id && enterprise_id!='') sqlQuery += ` AND J.id_enterprise=${enterprise_id}`
        if(enterprise!='') sqlQuery += ` AND U.name like '%${enterprise}%'`
        if(location!='') sqlQuery += ` AND U.id_location =${location}`
        if(sector!='') sqlQuery += ` AND E.id_sector =${sector}`

        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            const s1 = `SELECT * FROM location WHERE id_location=${it.id_location}`;
            const s2 = `SELECT * FROM benefit WHERE id_job=${it.id_job}`;
            const r1 =  await sqlAsync(s1, connection);
            const r2 =  await sqlAsync(s2, connection);
            const o1 = r1.length>0? r1[0].name: 'Desconocido'
            const o2 = r2.length>0? r2[0].descripcion.substring(0, 90): '(Sin descripción)'
            
            const item = {
                job_title: it.title,
                enterprise_name: it.name,
                date_end: getDateByNumber(it.end_ad_date),
                code: it.id_job,
                salary: it.salary,
                location: o1,
                modality: it.modality,
                description: o2,
                enterprise_id: it.id_user,
                enterprise_photo: it.photo,
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
    // const data = [
    //     {
    //         job_title: "Desarrollador de software",
    //         enterprise_name: "IBM del Perú", 
    //         date_end: "08-08-2023",
    //         code: 'C0987',
    //         salary: 1025,
    //         location: 'Lima',
    //         modality: 'Virtual',
    //         description: 'Breve descripsión del puesto de trabajo...',
    //         enterprise_id: '200',
    //         enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
    //     },
    //     {
    //         job_title: "Desarrollador de software",
    //         enterprise_name: "IBM del Perú", 
    //         date_end: "08-08-2023",
    //         code: 'C0987',
    //         salary: 1025,
    //         location: 'Lima',
    //         modality: 'virtual',
    //         description: 'Breve descripsión del puesto de trabajo...',
    //         enterprise_id: '200',
    //         enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
    //     },
    //     {
    //         job_title: "Desarrollador de software",
    //         enterprise_name: "IBM del Perú", 
    //         date_end: "08-08-2023",
    //         code: 'C0987',
    //         salary: 1025,
    //         location: 'Lima',
    //         modality: 'virtual',
    //         description: 'Breve descripsión del puesto de trabajo...',
    //         enterprise_id: '200',
    //         enterprise_photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
    //     },
    // ]

    // res.status(200).send({result: data, success: true, message: ""});

}
async function getJobByCode(req, res) { 
    const {code,myId,iamStudent} = req.params;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de estudiante";
    let data = null

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM job WHERE id_job=${code};`
        result =  await sqlAsync(sqlQuery, connection);

        if(result.length>0) {
            const job = result[0]
            const sqlEnt = `SELECT * FROM user WHERE id_user=${job.id_enterprise};`
            const en = await sqlAsync(sqlEnt, connection);
            const enterp = en[0];

            const us = await getUser(enterp, connection)
            if(!us.result) {
                result = false;
                error=us.error
            } else {
                const enterprise = us.user
                const s = `SELECT COUNT(*) AS total FROM studentxjob where active=1 AND id_job=${job.id_job} GROUP BY id_job;`
                const num = await sqlAsync(s, connection);
                const tot = num.length>0? num[0]: {total:0}

                let applied = false
                if(iamStudent=='1') {
                    const m = `SELECT * FROM studentxjob where active=1 AND id_student=${myId} AND id_job=${job.id_job};`
                    const mm = await sqlAsync(m, connection);
                    if(mm.length>0) {
                        const sxj = mm[0]
                        applied = sxj.relation==='P' || sxj.relation==='C';
                    }
                }

                data = {
                    enterprise_name: enterprise.name, 
                    enterprise_score: enterprise.score,
                    enterprise_id: enterprise.enterprise_id,
                    enterprise_sector: enterprise.sector_name,
                    enterprise_location: enterprise.location_name,
                    enterprise_photo: enterprise.photo,
                    job_title: job.title,
                    code: `${job.id_job}`,
                    date_end: getDateByNumber(job.end_ad_date),
                    job_start: getDateByNumber(job.job_start),
                    job_end: getDateByNumber(job.job_end),
                    salary: job.salary,
                    modality: job.modality,
                    vacancies: job.vacancies,
                    max_applicants: job.max_applicants,
                    sections: [],
                    registered: tot.total,
                    alredy_applied: applied,
                    active: true
                }
    
                const sql = `SELECT * FROM benefit WHERE id_job=${job.id_job} AND active=1;`
                const r =  await sqlAsync(sql, connection);
    
                for(let b of r) {
                    const item = {
                        id_benefit: `${b.id_benefit}`,
                        title: b.title,
                        description: b.descripcion,
                    }
                    data.sections.push(item)
                }
                success = true
            }

        }
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
async function applyJob(req, res) { 
    const {idUser, code} = req.body;

    let success = false;
    let message = "Error en el servicio de trabajos"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `INSERT INTO studentxjob(id_student,id_job,relation,active) 
            values(${idUser},${code},'P',1);`
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
async function noApplyJob(req, res) { 
    const {idUser, code} = req.body;

    let success = false;
    let message = "Error en el servicio de trabajos"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `DELETE FROM studentxjob WHERE id_student=${idUser} AND id_job=${code};`
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
async function createJob(req, res) { 
    const {job,salary,date_end,modality,vacancies,max,job_start,job_end,sections,id_enterprise} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empleos";
    let idInserted = ''

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `INSERT INTO job(title,end_ad_date,id_enterprise,salary,modality,vacancies,
            max_applicants,job_start,job_end,active) 
            values('${job}',${getTimeDate(date_end)},${id_enterprise},${salary},'${modality}',${vacancies},
            ${max},${getTimeDate(job_start)},${getTimeDate(job_end)},1);`
        const result =  await sqlAsync(sqlQuery, connection);

        if (result.affectedRows) {
            idInserted = result.insertId
            for(let s of sections) {
                let sql = `INSERT INTO benefit(title,descripcion,id_job,active) 
                    values('${s.title}','${s.description}',${result.insertId},1);`
                await sqlAsync(sql, connection);
            }
            success = true
        }
    } catch(e){
        console.log(e)
        success = false
        message = e.message
    }
    if(success) {
        res.status(200).send({result: {success, code: idInserted}, success, message});
    } else {
        res.status(505).send({ 
            message,
            success
        })
    }
    connection.end();

}
async function updateJob(req, res) { 
    const {job_title,code,date_end,job_start,job_end,salary,
        modality,vacancies,max_applicants,sections,active} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de empleos";

    connection.connect(err => {
        if (err) throw err;
    });

    try{
        let sqlQuery = `UPDATE job SET title='${job_title}',end_ad_date=${getTimeDate(date_end)},
        salary=${salary},modality='${modality}',vacancies=${vacancies},max_applicants=${max_applicants},
        job_start=${getTimeDate(job_start)},job_end=${getTimeDate(job_end)},active=${active?1:0} WHERE id_job=${code};`
        const result =  await sqlAsync(sqlQuery, connection);

        if (result.affectedRows) {
            for(let s of sections) {
                if(s.id_benefit) {
                    let sql = `UPDATE benefit SET title='${s.title}',descripcion='${s.description}' WHERE id_benefit=${s.id_benefit};`
                    await sqlAsync(sql, connection);
                } else {
                    let sql = `INSERT INTO benefit(title,descripcion,id_job,active) 
                    values('${s.title}','${s.description}',${code},1);`
                    await sqlAsync(sql, connection);
                }
            }
            success = true
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

    // res.status(200).send({result: data, success: true, message: ""});

}


module.exports = {
    getJobs,
    getJobByCode,
    applyJob,
    createJob,
    updateJob,
    noApplyJob
}




