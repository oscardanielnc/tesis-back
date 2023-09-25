const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const moment = require("moment");
const jwt = require("jwt-simple");
const { sqlAsync } = require('../utils/async');

async function enterpriseData(req, res) { 
    const {idUser} = req.params;

    const data = {
        ads: [
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                description: 'Breve descripsión del puesto de trabajo...'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                description: 'Breve descripsión del puesto de trabajo...'
            },
            {
                job_title: "Desarrollador de software",
                enterprise_name: "IBM del Perú", 
                date_end: "08-08-2023",
                code: 'C0987',
                description: 'Breve descripsión del puesto de trabajo...'
            },
        ],
        opinions: [
            {
                id: '123',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100',
                ruc: '20000000022'
            },
            {
                id: '123',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100',
                ruc: '20000000022'
            },
            {
                id: '123',
                enterprise_name: "IBM del Perú",
                score: 4,
                date_update: "08-08-2023",
                description: "Experiencia excelente!",
                student: "Oscar Navarro",
                student_id: '100',
                ruc: '20000000022'
            },
        ]
    }

    res.status(200).send({result: data, success: true, message: ""});

    // connection.end();

}

async function enterpriseExist(req, res) { 
    const {ruc} = req.params;

    let result = {
        exist: false,
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

    // const data = {
    //     exist: true,
    //     ruc: ruc,
    //     name: "IBM de Peru",
    //     photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c'
    // };
    // res.status(200).send({result: data, success: true, message: ""});

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
        score: 4.5,
        num_opinios: 2
    }
}


module.exports = {
    enterpriseData,
    enterpriseExist,
    getEnterprises,
    updateEnterprise,
    getScore
}