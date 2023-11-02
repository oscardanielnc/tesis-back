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

module.exports = {
    getDocumentsCycle,
    getAssessmentsCycle,
    deleteDocumentCycle,
    createAssessmentsCycle,
    getAssessmentData,
    insertCommentDeliv
}