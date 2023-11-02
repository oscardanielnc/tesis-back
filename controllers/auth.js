const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config");
const { sqlAsync } = require('../utils/async');
const {getScore} = require("./enterprise");
const { getTimeDate, getDateByNumber } = require('../utils/general-functions');

async function signIn(req, res) { 
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    const {attr, value, photo} = req.body;

    let result = true;
    let arrUsers = []
    let error = "Fallo del servidor al procesar usuario"

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        const sqlQueryUser = `SELECT * FROM user WHERE ${attr==='id'?'id_user':attr}=${attr==='id'? value: `'${value}'`} AND active=1;`
        const resultLUser  = await sqlAsync(sqlQueryUser, connection);

        if(resultLUser.length===0) {
            result = false;
            error = "Este usuario no tiene roles asignados"
        }

        for(let u of resultLUser) {
            const us = await getUser(u, connection, photo)
            if(!us.result) {
                result = false;
                error=us.error
            } else arrUsers.push(us.user)
        }
        result = true;

    } catch (e) {
        console.log(e)
        result = false;
        error = e.message
    }

    if(result && arrUsers.length>0) {
        res.status(200).send({result: arrUsers, success: result, message: error});
    } else {
        res.status(505).send({ 
            success: result,
            message: error
        })
    }
    connection.end();

}
async function signUp(req, res) {
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    const {role,name,lastname,email,photo,location,language,
        date,code,specialty,cycle,ruc,phone,sector,
        numEmployees,job} = req.body;

    let result = false;
    let user = {role,name,lastname,email,photo,location,
        languages: [],description: "",date, active: true}
    let error = "Error en el registro de usuario"

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        const bdate = new Date().getTime()
        const ddate = getTimeDate(date)

        const sqlQueryUser = `INSERT INTO user(role,name,lastname,email,photo,id_location,
            description,background,birstdate,update_state,active) 
            values('${role}','${name}','${lastname}','${email}','${photo}',${location},
            '','',${ddate},${bdate},1);`
        const resultUser  = await sqlAsync(sqlQueryUser, connection);
        const idUser = resultUser.insertId;

        if(idUser && idUser >= 0) {
            const sqlQueryLoc = `SELECT * FROM location WHERE id_location=${location};`
            const resultLoc  = await sqlAsync(sqlQueryLoc, connection);

            if(resultLoc.length>0) {
                const loc = resultLoc[0].name
                user = {
                    ...user,
                    location_name: loc
                }
            }

            if(role==='STUDENT' || role==='PROFESSOR') {
                const sqlQuerySpe = `SELECT * FROM specialty WHERE id_specialty=${specialty};`
                const resultSpe  = await sqlAsync(sqlQuerySpe, connection);

                if(resultSpe.length>0) {
                    const spe = resultSpe[0]
                    user = {
                        ...user,
                        specialty: spe.id_specialty,
                        specialty_name: spe.name,
                        max_cycles: spe.cycles,
                    }
                }
            }

            if(role==='STUDENT') {
                const sqlQueryType = `INSERT INTO student(id_user,code,cycle,cv_path,cv_update,id_specialty,phone,dni,active) 
                    values(${idUser},'${code}',${cycle},'',0,${specialty},'','',1);`
                const resultType  = await sqlAsync(sqlQueryType, connection);

                if(resultType.affectedRows) {
                    user = {
                        ...user,
                        code,cycle,
                        cv_path: '',
                        uploadDateCV: '',
                        phone:'',
                        dni:''
                    }
                    result = true;
                } else {
                    error = "No se completó el registro de estudiante"
                }
            } else if(role==='ENTERPRISE') {
                const sqlQueryType = `INSERT INTO enterprise(id_user,ruc,id_sector,phone,num_employees,blacklisted_state,active) 
                    values(${idUser},'${ruc}',${sector},'${phone}','${numEmployees}','A',1);`
                const resultType  = await sqlAsync(sqlQueryType, connection);

                const {score,num_opinios} = await getScore(idUser,connection);

                if(resultType.affectedRows) {
                    const sqlQuerySec = `SELECT * FROM sector WHERE id_sector=${sector};`
                    const resultSec  = await sqlAsync(sqlQuerySec, connection);

                    if(resultSec.length>0) {
                        const sec = resultSec[0]
                        user = {
                            ...user,
                            ruc,
                            phone,
                            sector,
                            sector_name: sec.name,
                            numEmployees,
                            score,
                            num_opinios,
                            enterprise_id: `${idUser}`
                        }
                        result = true;
                    } else {
                        error = "No se completó el registro de empresa"
                    }
                } else {
                    error = "No se completó el registro de empresa"
                }
            } else if(role==='EMPLOYED') {
                const sqlQueryEnt = `SELECT id_user FROM enterprise WHERE ruc='${ruc}';`
                const resultEnt  = await sqlAsync(sqlQueryEnt, connection);

                if(resultEnt.length>0) {
                    const ent = resultEnt[0]

                    const sqlQueryu = `SELECT * FROM user WHERE id_user=${ent.id_user};`
                    const resultu  = await sqlAsync(sqlQueryu, connection);

                    if(resultu.length>0) {
                        const emp = resultu[0]
                        const sqlQueryType = `INSERT INTO employed(id_user,ruc,id_enterprise,phone,job,reader,signatory,recruiter,active) 
                            values(${idUser},'${ruc}',${ent.id_user},'${phone}','${job}',0,0,0,1);`
                        const resultType  = await sqlAsync(sqlQueryType, connection);
        
                        if(resultType.affectedRows) {
                            user = {
                                ...user,ruc,phone,job,
                                enterprise_name: emp.name,
                                reader: false,
                                signatory: false,
                                recruiter: false,
                                enterprise_id: `${ent.id_user}`,
                                active: false
                            }
                            result = true;
                        }
                    } else {
                        error = "No se completó el registro de empleado"
                    }
                }

            } else if(role==='PROFESSOR') {
                const sqlQueryType = `INSERT INTO professor(id_user,id_specialty,coordinator,active) 
                    values(${idUser},${specialty},0,1);`
                const resultType  = await sqlAsync(sqlQueryType, connection);

                if(resultType.affectedRows) {
                    user = {
                        ...user,
                        coordinator: false
                    }
                    result = true;
                }else {
                    error = "No se completó el registro de profesor"
                }
            }
            if(result) {
                result = false;
                const sqlQueryType = `INSERT INTO userxlanguage(id_user,id_language,level,active) 
                    values(${idUser},${language},'Avanzado',1);`
                const resultType  = await sqlAsync(sqlQueryType, connection);
                if(resultType.affectedRows) {
                    const sqlQueryl = `SELECT * FROM language WHERE id_language=${language};`
                    const resultl  = await sqlAsync(sqlQueryl, connection);

                    if(resultl.length>0) {
                        const l = resultl[0]
                        user = {
                            ...user,
                            id: `${idUser}`,
                        }

                        user.languages.push({
                            value: `${l.id_language}`,
                            name: l.name,
                            level: 'Avanzado'
                        })
                        result = true;
                    }
                }else {
                    error = "No se completó el registro del idioma para este usuario"
                }
            }
        } else {
            error = "No se completó el registro de usuario"
        }
    } catch (e) {
        console.log(e)
        error = e.message
    }

    if(result) {
        res.status(200).send({result: user, success: result,message: error});
    } else {
        res.status(505).send({ 
            result: result,
            message: error
        })
    }
    connection.end();
}
async function updateProfile(req, res) {

    const {id,role,name,lastname,location,
        code,specialty,cycle,phone,sector,dni,
        numEmployees,job,description} = req.body;
    const cycleNum = cycle=='Egresado'? 100: cycle
        
    let result = false
    let error = "Error en la actualización del usuario";
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        let sqlQuery = `UPDATE user SET name='${name}',id_location=${location},description='${description}'`
        if(lastname && lastname!='' && role!=="ENTERPRISE") sqlQuery += `,lastname='${lastname}'`;
        sqlQuery += ` WHERE id_user=${id};`;
        const res = await sqlAsync(sqlQuery, connection);

        if(res.affectedRows) {
            if(role==='STUDENT') {
                let sql = `UPDATE student SET code='${code}',dni='${dni}',phone='${phone}',id_specialty=${specialty},cycle=${cycleNum} WHERE id_user=${id};`
                const r = await sqlAsync(sql, connection);

                if(r.affectedRows) result = true;
            }
            else if(role==='ENTERPRISE') {
                let sql = `UPDATE enterprise SET phone='${phone}',id_sector=${sector},num_employees='${numEmployees}' WHERE id_user=${id};`
                const r = await sqlAsync(sql, connection);

                if(r.affectedRows) result = true;
            }
            else if(role==='EMPLOYED') {
                let sql = `UPDATE employed SET phone='${phone}',job='${job}' WHERE id_user=${id};`
                const r = await sqlAsync(sql, connection);

                if(r.affectedRows) result = true;
            }
        }

    } catch(e) {
        console.log(e)
        error = e.message
        result = false
    }

    res.status(200).send({result: result, success: result, message: error});
}
async function getUser(resultLUser, connection,photo) {
    const idUser = resultLUser.id_user
    let result = false;
    let error = "No se ha encontrado al usuario"
    let user = {}

    try {
        if(idUser && idUser >= 0) {
            if(photo&&photo!='') {
                const sqlQuery = `UPDATE user SET photo='${photo}' WHERE id_user=${idUser};`
                await sqlAsync(sqlQuery, connection);
            }
        
            user = {
                ...user,
                id: `${idUser}`,
                role: resultLUser.role,
                name: resultLUser.name,
                lastname: resultLUser.lastname,
                email: resultLUser.email,
                location: resultLUser.id_location,
                languages: [],
                description: resultLUser.description,
                date: resultLUser.birstdate,
                active: resultLUser.active==1,
                // sign: resultLUser.sign,
                photo: photo&&photo!=''? photo: resultLUser.photo
            }
    
            if(resultLUser.id_location) {
                const sqlQueryLoc = `SELECT * FROM location WHERE id_location=${resultLUser.id_location};`
                const resultLoc  = await sqlAsync(sqlQueryLoc, connection);
        
                if(resultLoc.length>0) {
                    const loc = resultLoc[0].name
                    user = {
                        ...user,
                        location_name: loc
                    }
                }
            }
    
            if(resultLUser.role==='STUDENT') {
                const sqlQueryType = `SELECT * FROM student WHERE id_user=${idUser}`
                const resultType  = await sqlAsync(sqlQueryType, connection);
    
                if(resultType.length>0) {
                    const typeUser = resultType[0]
                    user = {
                        ...user,
                        code: typeUser.code,
                        cycle: typeUser.cycle,
                        cv_path: typeUser.cv_path,
                        phone: typeUser.phone,
                        dni: typeUser.dni,
                        uploadDateCV: getDateByNumber(typeUser.cv_update),
                        id_specialty: typeUser.id_specialty
                    }
                    result = true;
                } else {
                    error = "No se han encontrado los datos del estudiante"
                }
            } else if(resultLUser.role==='ENTERPRISE') {
                    const sqlQueryType = `SELECT * FROM enterprise WHERE id_user=${idUser}`
                    const resultType  = await sqlAsync(sqlQueryType, connection);
    
                    const {score,num_opinios} = await getScore(idUser,connection);
    
                    if(resultType.length>0) {
                        const typeUser = resultType[0]
    
                        const sqlQuerySec = `SELECT * FROM sector WHERE id_sector=${typeUser.id_sector};`
                        const resultSec  = await sqlAsync(sqlQuerySec, connection);
    
                        if(resultSec.length>0) {
                            const sec = resultSec[0]
                            user = {
                                ...user,
                                ruc: typeUser.ruc,
                                phone: typeUser.phone,
                                sector: typeUser.id_sector,
                                sector_name: sec.name,
                                numEmployees: typeUser.num_employees,
                                score,
                                num_opinios,
                                enterprise_id: `${idUser}`
                            }
                            result = true;
                        }else {
                            error = "No se han encontrado los datos de la empresa"
                        }
    
                    }
            } else if(resultLUser.role==='EMPLOYED') {
                const sqlQueryType = `SELECT * FROM employed WHERE id_user=${idUser};`
                const resultType  = await sqlAsync(sqlQueryType, connection);
    
                if(resultType.length>0) {
                    const typeUser = resultType[0]
    
                    const sqlQueryu = `SELECT * FROM user WHERE id_user=${typeUser.id_enterprise};`
                    const resultu  = await sqlAsync(sqlQueryu, connection);

                    
                    if(resultu.length>0) {
                        const emp = resultu[0]
                        
                        if(emp.active==0) {
                            return {result: false, error: "Empresa inactiva", user: null}
                        } else {
                            const sqlQuerye = `SELECT * FROM enterprise WHERE id_user=${typeUser.id_enterprise};`
                            const resulte  = await sqlAsync(sqlQuerye, connection);
                            const ent = resulte[0]

                            if(ent.blacklisted_state==='B') {
                                return {result: false, error: "Empresa en lista negra", user: null}
                            }
                        }
        
                        user = {
                            ...user,
                            phone: typeUser.phone,
                            job: typeUser.job,
                            enterprise_name: emp.name,
                            reader: typeUser.reader==1,
                            signatory: typeUser.signatory==1,
                            recruiter: typeUser.recruiter==1,
                            enterprise_id: `${typeUser.id_enterprise}`
                        }
                        result = true;
                    }else {
                        error = "No se han encontrado los datos del empleado"
                    }
                }
    
            } else if(resultLUser.role==='PROFESSOR') {
                const sqlQueryType = `SELECT * FROM professor WHERE id_user=${idUser};`
                const resultType  = await sqlAsync(sqlQueryType, connection);
    
                if(resultType.length>0) {
                    const typeUser = resultType[0]
                    user = {
                        ...user,
                        coordinator: typeUser.coordinator==1,
                        id_specialty: typeUser.id_specialty
                    }
                    result = true;
                } else {
                    error = "No se han encontrado los datos del profesor"
                }
            } else {
                result = true;
            }
    
            if(result) {
                
                const sqlQueryType = `SELECT * FROM userxlanguage WHERE id_user=${idUser} AND active=1;`
                const resultType  = await sqlAsync(sqlQueryType, connection);

                if(resultType.length>0) {
                    for(let uxl of resultType) {
                        const sqlQueryl = `SELECT * FROM language WHERE id_language=${uxl.id_language};`
                        const resultl  = await sqlAsync(sqlQueryl, connection);

                        if(resultl.length>0) {
                            const l = resultl[0]

                            user.languages.push({
                                value: `${l.id_language}`,
                                name: l.name,
                                level: uxl.level,
                            })
                        }
                    }

                }
                if(resultLUser.role==='STUDENT' || resultLUser.role==='PROFESSOR') {
                    result = false;
                    const sqlQuerySpe = `SELECT * FROM specialty WHERE id_specialty=${user.id_specialty};`
                    const resultSpe  = await sqlAsync(sqlQuerySpe, connection);
    
                    if(resultSpe.length>0) {
                        const spe = resultSpe[0]
                        user = {
                            ...user,
                            specialty: spe.id_specialty,
                            specialty_name: spe.name,
                            max_cycles: spe.cycles,
                        }
                        result = true;
                    }else {
                        error = "No se han encontrado datos de la especialidad del usuario"
                    }
                }
            }
        }
    } catch (e) {
        console.log(e)
        error = e.message
        result = false
    }

    return {result, error, user}
}


module.exports = {
    signIn,
    signUp,
    updateProfile,
    getUser
}