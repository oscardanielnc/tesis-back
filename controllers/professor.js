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

    const {name, cycle, supervisor, state} = req.body;
    const data = [
        {
            name: 'Oscar Daniel Navarro Cieza',
            code: '20186008',
            id: '1',
            photo: 'jsksk',
            supervisor: 'Eduardo Quiñones',
            supervisor_id: '1',
            score: 20,
            state: 'Aprobado',
            enrollment: true
        },
        {
            name: 'Oscar Daniel Navarro Cieza',
            code: '20186008',
            id: '2',
            photo: 'jsksk',
            supervisor: 'Eduardo Quiñones',
            supervisor_id: '1',
            score: -1,
            state: 'Matriculado',
            enrollment: true
        },
        {
            name: 'Oscar Daniel Navarro Cieza',
            code: '20186008',
            id: '3',
            photo: 'jsksk',
            supervisor: 'Eduardo Quiñones',
            supervisor_id: '1',
            score: -1,
            state: 'No Matriculado',
            enrollment: false
        },
    ]
        
    const result = true

    res.status(200).send({result: data, success: result, message: ""});

    // connection.end();
}
async function getSupervisors(req, res) {

    const {specialty} = req.params;
    const data = [
        {
            value: '1',
            name: 'Eduardo Quiñores'
        },
        {
            value: '2',
            name: 'Dante Torres'
        },
        {
            value: '3',
            name: 'Claudia Guerra'
        },
    ]
        
    const result = true

    res.status(200).send({result: data, success: result, message: ""});

    // connection.end();
}
async function registration(req, res) {

    const {specialty, cycle, student} = req.body;
        
    const result = true

    res.status(200).send({result: result, success: result, message: ""});

}
async function assignSupervisor(req, res) {

    const {specialty, cycle, student, supervisor} = req.body;
        
    const result = true

    res.status(200).send({result: result, success: result, message: ""});

}
async function assignScore(req, res) {

    const {specialty, cycle, student, score} = req.body;
        
    const result = true

    res.status(200).send({result: result, success: result, message: ""});

}

module.exports = {
    updateProfessor,
    getStudentsProfessor,
    getSupervisors,
    registration,
    assignSupervisor,
    assignScore
}