const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');
const { getDate2ByNumber, getTimeDate, nowTime } = require('../utils/general-functions');

async function getDocumentsCycle(req, res) {
    const {cycle, specialty} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let data = []
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sql = `SELECT * FROM document WHERE id_specialty=${specialty} AND id_period=${cycle} AND active=1;`
        const l =  await sqlAsync(sql, connection);
        data = l
        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: data, success: result, message: ""});
    connection.end();
}
async function deleteDocumentCycle(req, res) {
    const {id_document} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `UPDATE document SET active=0 WHERE id_document=${id_document};`
        await sqlAsync(sqlQueryType, connection);

        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: result, success: result, message: ""});
    connection.end();
}
async function registerEnterpriseForm(req, res) {
    const {enterprise_id,enterprise_name,enterprise_photo,ruc,id_studentxperiod,id_student} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `UPDATE studentxperiod SET id_enterprise=${enterprise_id}, ruc='${ruc}', 
        enterprise_name='${enterprise_name}', enterprise_photo='${enterprise_photo}'
        WHERE id_studentxperiod=${id_studentxperiod};`
        await sqlAsync(sqlQueryType, connection);

        const sqlQuery = `INSERT INTO opinion(id_studentxperiod,id_enterprise,id_creator,active,student_date,enterprise_date,score,comment_student,comment_enterprise,
            s1,s2,s3,s4,s5,s6,s7,s8,e1,e2,e3,e4,e5,e6,e7,e8) 
            values(${id_studentxperiod},${enterprise_id},${id_student},1,0,0,0,'','',
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);`
        await sqlAsync(sqlQuery, connection);

        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: result, success: result, message: ""});
    connection.end();
}
async function insertCommentDeliv(req, res) {
    const {id_deliver,descripcion} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `INSERT INTO comment(id_deliver,descripcion,date,active) 
        values(${id_deliver},'${descripcion}',${nowTime()},1);`
        await sqlAsync(sqlQueryType, connection);

        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: result, success: result, message: ""});
    connection.end();
}
async function getAssessmentsCycle(req, res) {
    const {cycle, specialty, student} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let data = []
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sql = `SELECT * FROM assessment WHERE id_specialty=${specialty} AND id_period=${cycle} AND active=1;`
        const las =  await sqlAsync(sql, connection);

        if(student && student!='x') {
            for(let it of las) {
                const sqlStu = `SELECT * FROM deliver WHERE id_student=${student} AND id_assessment=${it.id_assessment};`
                const delivs =  await sqlAsync(sqlStu, connection);
                let s = "Pendiente"
                let d = null
                if(delivs.length>0) {
                    const myDel = delivs[0]
                    s = "Entregado"
                    d = getDate2ByNumber(myDel.update_date)
                }
    
                const item = {
                    ...it,
                    state: s,
                    update_date: d
                }
                data.push(item)
            }
        } else data = las
        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: data, success: result, message: ""});
    connection.end();
}
async function getAssessmentData(req, res) {
    const {id_assessment,id_student,cycle,specialty,id_supervisor} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let data = {}
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        // Entregable
        const sql = `SELECT * FROM assessment WHERE id_assessment=${id_assessment};`
        const ass =  await sqlAsync(sql, connection);
        const assessment = ass[0]

        if(id_student==null) {
            // Lista de alumnos
            const iamSup = id_supervisor? ` AND S.id_supervisor=${id_supervisor} `: ''
            const sql2 = `SELECT U.id_user, U.name, U.lastname, U.photo FROM studentxperiod AS S
             INNER JOIN user AS U ON S.id_student = U.id_user
             WHERE S.id_specialty=${specialty} ${iamSup}
             AND S.id_period=${cycle} AND S.active=1;`
            const sxp =  await sqlAsync(sql2, connection);
            // Lista de entregas
            const sqlStu = `SELECT * FROM deliver WHERE id_assessment=${id_assessment} AND active=1;`
            const delivs =  await sqlAsync(sqlStu, connection);
            
            const delivers = []
            for(let it of sxp) {
                const deliv = getDeliv(it.id_user, delivs)
                let comments = []
                if(deliv.id_deliver) {
                    const sqlCooms = `SELECT * FROM comment WHERE id_deliver=${deliv.id_deliver} AND active=1  ORDER BY id_comment DESC;`
                    const comms =  await sqlAsync(sqlCooms, connection);
                    comments = comms
                }

                const item = {
                    student_name: `${it.name} ${it.lastname}`,
                    photo: it.photo,
                    id_student: it.id_user,
                    name_doc: deliv.name,
                    update_date: deliv.update_date,
                    path: deliv.path,
                    id_deliver: deliv.id_deliver,
                    comments
                }
                delivers.push(item)
            }
            data = {
                assessment,
                delivers
            }
        } else {
            const sqlStu = `SELECT * FROM deliver WHERE id_assessment=${id_assessment} AND id_student=${id_student} AND active=1;`
            const delivs =  await sqlAsync(sqlStu, connection);

            let myDeliver = {
                name_doc: 'Documento no enviado',
                update_date: -1,
                path: '',
                id_deliver: null,
                comments: []
            }
            if(delivs.length>0) {
                const deliv = delivs[0]
                const sqlCooms = `SELECT * FROM comment WHERE id_deliver=${deliv.id_deliver} AND active=1 ORDER BY id_comment DESC;`
                const comms =  await sqlAsync(sqlCooms, connection);

                myDeliver = {
                    name_doc: deliv.name,
                    update_date: deliv.update_date,
                    path: deliv.path,
                    id_deliver: deliv.id_deliver,
                    comments: comms
                }
            }
            data = {
                assessment,
                myDeliver
            }
        }


        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: data, success: result, message: ""});
    connection.end();
}
async function getFormOpinions(req, res) {
    const {id_specialty,id_period} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let data = []
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sql2 = `SELECT U.id_user, U.name, U.lastname, U.photo, S.enterprise_name, S.id_studentxperiod, S.id_student,
            S.id_enterprise, S.form_student, S.form_enterprise, S.ruc, S.enterprise_photo 
            FROM studentxperiod AS S
            INNER JOIN user AS U ON S.id_student = U.id_user
            WHERE S.id_specialty=${id_specialty} AND S.id_period=${id_period} AND S.active=1 ORDER BY S.id_studentxperiod DESC;`
        const sxp =  await sqlAsync(sql2, connection);

        for(let it of sxp) {
            let opinion = null
            if(it.id_enterprise) {
                const sqlCooms = `SELECT * FROM opinion WHERE id_studentxperiod=${it.id_studentxperiod} AND active=1;`
                const comms =  await sqlAsync(sqlCooms, connection);
                opinion = comms[0]
            }

            const item = {
                ...it,
                form_student: it.form_student==1,
                form_enterprise: it.form_enterprise==1,
                opinion
            }
            data.push(item)
        }
        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: data, success: result, message: ""});
    connection.end();
}

async function getStudentOpinions(req, res) {
    const {id_enterprise} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let data = []
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sql2 = `SELECT U.id_user, U.name, U.lastname, U.photo, S.id_studentxperiod, S.id_student,
            S.form_student, S.form_enterprise
            FROM studentxperiod AS S
            INNER JOIN user AS U ON S.id_student = U.id_user
            WHERE S.id_enterprise=${id_enterprise} AND S.active=1 ORDER BY S.id_studentxperiod DESC;`
        const sxp =  await sqlAsync(sql2, connection);

        for(let it of sxp) {
            let opinion = null
            const sqlCooms = `SELECT * FROM opinion WHERE id_studentxperiod=${it.id_studentxperiod} AND active=1;`
            const comms =  await sqlAsync(sqlCooms, connection);
            opinion = comms[0]

            const item = {
                ...it,
                form_student: it.form_student==1,
                form_enterprise: it.form_enterprise==1,
                opinion
            }
            data.push(item)
        }
        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: data, success: result, message: ""});
    connection.end();
}
function getDeliv(idUser,delivs) {
    for(let item of delivs) {
        if(item.id_student==idUser) {
            return item
        }
    }
    return {
        name: 'Documento no enviado',
        update_date: -1,
        path: '',
        id_deliver: null
    }
}
async function createAssessmentsCycle(req, res) {
    const {cycle,specialty,id_profesor,title,descripcion,date_end} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `INSERT INTO assessment(title,descripcion,id_professor,id_specialty,id_period,date_end,active) 
        values('${title}','${descripcion}',${id_profesor},${specialty},${cycle},${getTimeDate(date_end)},1);`
        const resultType  = await sqlAsync(sqlQueryType, connection);
        
        if(resultType.affectedRows) {
            res.status(200).send({
                success: true,
                result: true,
                message: "Entregable creado!"
            })
        }
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }
    connection.end();
}

async function getMyFormOpinion(req, res) {
    const {id_student, id_specialty,id_period} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let data = {}
    let result = false
    let message = "Estudiante no matriculado en el semestre"

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlx = `SELECT * FROM studentxperiod WHERE id_student=${id_student} AND 
        id_specialty=${id_specialty} AND id_period=${id_period} AND active=1;`
        const sxp =  await sqlAsync(sqlx, connection);

        if(sxp.length>0) {
            const periodStudent = sxp[0]
            let sql = `SELECT * FROM opinion WHERE id_studentxperiod=${periodStudent.id_studentxperiod} AND active=1;`
            const opinions =  await sqlAsync(sql, connection);
            const opinion = opinions.length>0? opinions[0]: null

            data = {
                periodStudent,
                opinion
            }
            result = true
        }
        
    } catch(e){
        console.log(e)
        message = e.message
    }

    res.status(200).send({result: data, success: result, message: message});
    connection.end();
}
async function sendSurvey(req, res) {
    const {person} = req.body;
    const person_type = person=='s'? 'student': 'enterprise'
    
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const attr_form = `comment_${person_type}`
        const sqlQueryType = `UPDATE studentxperiod SET form_${person_type}=1
        WHERE id_studentxperiod=${req.body.id_studentxperiod};`
        await sqlAsync(sqlQueryType, connection);

        const sqlQuery = `UPDATE opinion SET ${person_type}_date=${nowTime()}, score=${getScore(req.body,person)}, 
        ${attr_form}='${req.body[attr_form]}' ${getSubScore(req.body,person)} 
        WHERE id_opinion=${req.body.id_opinion};`
        await sqlAsync(sqlQuery, connection);

        result = true
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    res.status(200).send({result: result, success: result, message: ""});
    connection.end();
}
function getScore(form, person) {
    if(person!='s') return 0

    let score = 0
    for(let i=1; i<=8; i++) {
        const attr = `s${i}`
        const val = Number(form[attr])
        score += val;
    }
    return score;
}

function getSubScore(form, person) {
    let string = ''
    for(let i=1; i<=8; i++) {
        const attr = `${person}${i}`
        const val = Number(form[attr])
        const str = ` ,${attr}=${val} `
        string += str;
    }
    return string;
}

module.exports = {
    getDocumentsCycle,
    getAssessmentsCycle,
    deleteDocumentCycle,
    createAssessmentsCycle,
    getAssessmentData,
    insertCommentDeliv,
    registerEnterpriseForm,
    getMyFormOpinion,
    sendSurvey,
    getFormOpinions,
    getStudentOpinions
}