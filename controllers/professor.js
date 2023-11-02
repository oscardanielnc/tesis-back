const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');

async function updateProfessor(req, res) {
    const {active, coordinator, id, specialty} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let result = false

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        if(coordinator) {
            let sqlProf = `SELECT * FROM professor WHERE id_specialty=${specialty} AND ( coordinator=1 OR id_user=${id});`
            const listOfProfs =  await sqlAsync(sqlProf, connection);
            for(let prof of listOfProfs) {
                const sqlQuery = `UPDATE professor SET coordinator=${prof.id_user==id?1:0} WHERE id_user=${prof.id_user};`
                await sqlAsync(sqlQuery, connection);
            }
        } else {
            const sqlQuery = `UPDATE user SET active=${active?1:0} WHERE id_user=${id};`
            await sqlAsync(sqlQuery, connection);
        }
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

async function getStudentsProfessor(req, res) {
    const {name, cycle, supervisor, state, specialty} = req.body;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de trabajos";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT U.name, U.lastname, U.id_user, U.photo, S.code
        FROM student AS S
        INNER JOIN user AS U ON U.id_user = S.id_user
        WHERE CONCAT(U.name, ' ', U.lastname) like '%${name}%' AND U.active=1 AND S.id_specialty=${specialty};`;

        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            let item = {
                name: `${it.name} ${it.lastname}`,
                code: it.code,
                id: it.id_user,
                photo: it.photo,
            }

            let sxp = null
            let sup = null
            if(cycle && cycle!='') {
                const s1 = `SELECT * FROM studentxperiod WHERE id_student=${it.id_user} AND id_period=${cycle};`;
                const r1 =  await sqlAsync(s1, connection);
                if(r1.length>0) sxp = r1[0]
            } else {
                const s1 = `SELECT * FROM studentxperiod WHERE id_student=${it.id_user};`;
                const r1 =  await sqlAsync(s1, connection);
                if(r1.length>0) sxp = r1[0]
            }

            if(sxp && sxp.id_supervisor) {
                const s1 = `SELECT * FROM user WHERE id_user=${sxp.id_supervisor};`;
                const r1 =  await sqlAsync(s1, connection);
                if(r1.length>0) sup = r1[0]
            }
            item = {
                ...item,
                supervisor: sup? `${sup.name} ${sup.lastname}`: '',
                supervisor_id: sup? sup.id_supervisor: '',
                score: sxp? sxp.score: null,
                state: sxp? (sxp.score===null? 'Matriculado': (sxp.score<=10? "Desaprobado": "Aprobado")): 'No Matriculado',
                enrollment: !!sxp
            }
            let valid = true
            if(cycle && cycle!='' && !sxp) valid = false
            if(supervisor && supervisor!='' && !sup) valid = false
            if(state && state!='' && item.state!=state) valid = false
            if(valid) data.push(item)
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

async function getSupervisors(req, res) {
    const {specialty} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de trabajos";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT U.name, U.lastname, U.id_user
        FROM professor AS S
        INNER JOIN user AS U ON U.id_user = S.id_user
        WHERE U.active=1 AND S.id_specialty=${specialty} AND S.coordinator=0;`;

        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            let item = {
                name: `${it.name} ${it.lastname}`,
                value: `${it.id_user}`,
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
async function getProfessors(req, res) {
    const {specialty} = req.params;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de profesores";

    const data = []

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT U.name, U.lastname, U.id_user, S.coordinator, U.photo
        FROM professor AS S
        INNER JOIN user AS U ON U.id_user = S.id_user
        WHERE U.active=1 AND S.id_specialty=${specialty};`;

        const result =  await sqlAsync(sqlQuery, connection);

        for(let it of result) {
            let item = {
                name: `${it.name} ${it.lastname}`,
                id: `${it.id_user}`,
                coordinator: it.coordinator==1,
                photo: it.photo
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
async function registration(req, res) {

    const {specialty, cycle, student} = req.body;
        
    let success = false;
    let message = "Error en el servicio de registro"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `INSERT INTO studentxperiod(score,id_supervisor,id_student,id_enterprise,ruc,
            enterprise_name,enterprise_photo,form_student,form_enterprise,id_period,id_specialty,active) 
            values(null,null,${student},null,null,
            null,null,0,0,${cycle},${specialty},1);`
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
async function noRegistration(req, res) {

    const {specialty, cycle, student} = req.body;
        
    let success = false;
    let message = "Error en el servicio de registro"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `DELETE FROM studentxperiod WHERE id_student=${student} AND id_period=${cycle} AND id_specialty=${specialty};`
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
async function assignSupervisor(req, res) {

    const {specialty, cycle, student, supervisor} = req.body;

    let success = false;
    let message = "Error en el servicio de registro"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `UPDATE studentxperiod SET id_supervisor=${supervisor}
         WHERE id_student=${student} AND id_period=${cycle} AND id_specialty=${specialty};`
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
async function assignScore(req, res) {

    const {specialty, cycle, student, score} = req.body;
        
    let success = false;
    let message = "Error en el servicio de notas"
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        const sqlQueryType = `UPDATE studentxperiod SET score=${score}
         WHERE id_student=${student} AND id_period=${cycle} AND id_specialty=${specialty};`
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

module.exports = {
    updateProfessor,
    getStudentsProfessor,
    getSupervisors,
    registration,
    assignSupervisor,
    assignScore,
    noRegistration,
    getProfessors
}