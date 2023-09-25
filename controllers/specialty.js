const mysql = require('mysql');
const {MYSQL_CREDENTIALS, PANDA_KEY} = require("../config");
const { sqlAsync } = require('../utils/async');

async function getSpecialties(req, res) { 
    const {name, active, admin} = req.body
    const data = []
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });
    try{
        let sqlQuery = `SELECT * FROM specialty WHERE name like '%${name}%'`
        if(active) sqlQuery + ` AND active=${active?1:0};`;
        const result =  await sqlAsync(sqlQuery, connection);

        for(let spe of result) {
            const spec = {
                ...spe,
                value: `${spe.id_specialty}`,
                active: spe.active==1,
                professors: []
            }
            if(admin) {
                let sqlQuery = `SELECT U.id_user, U.name, U.lastname, P.coordinator, U.update_state, U.photo, U.active
                    FROM user AS U INNER JOIN professor AS P on U.id_user = P.id_user WHERE P.id_specialty = ${spe.id_specialty};`;
                const resultP =  await sqlAsync(sqlQuery, connection);
    
                for(let p of resultP) {
                    const prof = {
                        id: p.id_user,
                        name: p.name, 
                        last_name: p.lastname, 
                        coordinator: p.coordinator==1,
                        update_date: p.update_state,
                        photo: p.photo,
                        active: p.active==1
                    }
                    spec.professors.push(prof)
                }
            }
            data.push(spec)
        }
    } catch(e){
        console.log(e)
        res.status(505).send({ 
            message: e.message,
            success: false
        })
    }

    // const data = [
    //     {
    //         value: '1',
    //         name: 'Ingeniería informática',
    //         cycles: 10,
    //         active: true,
    //         professors: [ //solo si admin true
    //             {
    //                 id: '12',
    //                 name: 'Ernesto', 
    //                 last_name: 'Quiñores', 
    //                 coordinator: true,
    //                 update_date: "2023/09/09",
    //                 photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
    //                 active: true
    //             },
    //             {
    //                 id: '13',
    //                 name: 'Ernesto', 
    //                 last_name: 'Quiñores', 
    //                 coordinator: false,
    //                 update_date: "2023/09/09",
    //                 photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
    //                 active: false
    //             },
    //             {
    //                 id: '14',
    //                 name: 'Ernesto', 
    //                 last_name: 'Quiñores', 
    //                 coordinator: false,
    //                 update_date: "2023/09/09",
    //                 photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
    //                 active: true
    //             },
    //         ]
    //     },
    //     {
    //         value: '2',
    //         name: 'Derecho',
    //         cycles: 12,
    //         active: true,
    //         professors: [
    //             {
    //                 id: '12',
    //                 name: 'Ernesto', 
    //                 last_name: 'Quiñores', 
    //                 coordinador: true,
    //                 update_date: "2023/09/09",
    //                 photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
    //                 active: true
    //             },
    //             {
    //                 id: '13',
    //                 name: 'Ernesto', 
    //                 last_name: 'Quiñores', 
    //                 coordinador: false,
    //                 update_date: "2023/09/09",
    //                 photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
    //                 active: true
    //             },
    //             {
    //                 id: '14',
    //                 name: 'Ernesto', 
    //                 last_name: 'Quiñores', 
    //                 coordinador: false,
    //                 update_date: "2023/09/09",
    //                 photo: 'https://lh3.googleusercontent.com/a/AAcHTtcLAoj-9rKUOQ-m3z4iMUv_xdTZOEUcy2AApme_jh6f00Q=s96-c',
    //                 active: true
    //             },
    //         ]
    //     },
    // ]

    res.status(200).send({result: data, success: true, message: ""});
    connection.end();
}

async function createSpecialty(req, res) { 
    const {name, cycles, active} = req.body
    let result = false;
    let error = "Error en la creación de la especialidad"

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        const sqlQuery = `INSERT INTO specialty(cycles,name,active) values(${cycles},'${name}',${active?1:0});`
        const resultq  = await sqlAsync(sqlQuery, connection);
        const id = resultq.insertId;

        if(id && id >= 0) {
            result = true;
        } else {
            error = "No se completó el registro de la especialidad"
        }
    } catch (e) {
        console.log(e)
        error = e.message
    }
    if(result) {
        res.status(200).send({result: result, success: result, message: error});
    } else {
        res.status(505).send({ 
            message: error,
            success: result
        })
    }
    connection.end();

}
async function updateSpecialty(req, res) { 
    const {value, name, cycles, active} = req.body
    let result = false;
    let error = "Error en la actualización de la especialidad"

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        const sqlQuery = `UPDATE specialty SET name='${name}',cycles=${cycles},active=${active?1:0} WHERE id_specialty=${value};`
        const resultq  = await sqlAsync(sqlQuery, connection);

        if(resultq.affectedRows) {
            result = true;
        } else {
            error = "No se completó la actualización de la especialidad"
        }
    } catch (e) {
        console.log(e)
        error = e.message
    }
    if(result) {
        res.status(200).send({result: result, success: result, message: error});
    } else {
        res.status(505).send({ 
            message: error,
            success: result
        })
    }
    connection.end();

}

module.exports = {
    getSpecialties,
    createSpecialty,
    updateSpecialty
}