const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config")
const { sqlAsync } = require('../utils/async');
const { nowTime } = require('../utils/general-functions');
const { MAIN_PAGE, mailFormater } = require('../utils/const');
const { sendEmail } = require('../utils/sendEmail');

async function uploadCV(req,res) {
    const {id} = req.params;
    const files = req.files;

    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    connection.connect(err => {
        if (err) throw err;
    });

    if(files && Object.keys(files).length !== 0) {
        //files contine varios archivos. Solo quiero 1
        const attr = `file0`
        const objDoc = files[attr]
        // const docPathName = objDoc.path.split("/")[2]; //linux
        const docPathName = objDoc.path.split("\\")[2];

        const sqlQueryType = `UPDATE student SET cv_path='${docPathName}', cv_update=${nowTime()} WHERE id_user=${id};`
        const resultType  = await sqlAsync(sqlQueryType, connection);
        
        if(resultType.affectedRows) {
            res.status(200).send({
                success: true,
                result: docPathName,
                message: "Archivos insertados correctamente!"
            })
        }

    } else {
        res.status(505).send({
            success: false,
            message: "No se han enviado archivos!"
        })
    }
    connection.end();
}

async function uploadAgreement(req,res) {
    const {id, employed} = req.params;
    const files = req.files;
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    let success = false
    let message = "Error en el servicio de convenios";

    connection.connect(err => {
        if (err) throw err;
    });

    try {
        const sqlAg = `SELECT * FROM agreement WHERE id_agreement=${id};`;
        const resAg = await sqlAsync(sqlAg, connection);
        const agree = resAg[0]
        const sqlStu = `SELECT * FROM user WHERE id_user=${agree.id_student};`;
        const resStu = await sqlAsync(sqlStu, connection);
        const student = resStu[0]
        const subject = `Convenio ${agree.name}`
        const arr = [`Le informamos que su convenio de prácticas para el puesto de ${agree.name} ha sido cargado.`,
                    `Puede ver los detalles del puesto de trabajo y el estado de su convenio ingresando a ${MAIN_PAGE}.`]
        const text = mailFormater(`${student.name} ${student.lastname}`,arr)
        await sendEmail(student.email, subject, text)
        success=true

    }catch(e) {
        console.log(e)
        success = false
        message = e.message
    }
    connection.end();

    if(success) {
        const sqlQueryType = `UPDATE agreement SET document_path='#####', id_employed=${employed}, 
        observation_student='', observation_ie='', observation_date_st=0, observation_date_ie=0, 
        date_student=0, date_enterprise=0, date_professor=0
        WHERE id_agreement=${id};`
    
        await uploadDoc(files, sqlQueryType, res)
    } else {
        res.status(505).send({
            success: false,
            message: message
        })
    }
}

async function uploadDoc(files, sql, res) {
    const connection = mysql.createConnection(MYSQL_CREDENTIALS);
    connection.connect(err => {
        if (err) throw err;
    });

    if(files && Object.keys(files).length !== 0) {
        //files contine varios archivos. Solo quiero 1
        const attr = `file0`
        const objDoc = files[attr]
        // const docPathName = objDoc.path.split("/")[2]; //linux
        const docPathName = objDoc.path.split("\\")[2];

        const resultType  = await sqlAsync(sql.replace('#####', docPathName), connection);
        
        if(resultType.affectedRows) {
            res.status(200).send({
                success: true,
                result: docPathName,
                message: "Archivos insertados correctamente!"
            })
        }

    } else {
        res.status(505).send({
            success: false,
            message: "No se han enviado archivos!"
        })
    }
    connection.end();
}

function getDoc(req, res) {
    const filePath = req.params.filePath;
    const fileName = req.params.fileName || `blank.${filePath.split(".")[1]}`;
    const exactPath = `./uploads/docs/${filePath}`;
    const extention = filePath.split(".")[1]
    const exactName = `${fileName}.${extention}`

    res.download(exactPath, exactName, (err) => {
        if(err) {
            console.log(err)
        }
    });
}

// function deleteDoc(req, res) {
//     const connection = mysql.createConnection(MYSQL_CREDENTIALS);
//     const {idDoc} = req.params;
//     const sqlQuery = `UPDATE Documento SET activo=0 WHERE idDocumento=${idDoc};`;
//     connection.connect(err => {
//         if (err) throw err;
//     });
//     connection.query(sqlQuery, (err, result) => {
//         if (err) {
//             console.log(err)
//             res.status(505).send({
//                 success: false,
//                 message: "Error: No se puede eliminar el docuemnto!"
//             })
//         }
        
//         res.status(200).send({
//             success: true,
//             message: "Documento eliminado!"
//         })
//     });

//     connection.end();
// }


module.exports = {
    uploadAgreement,
    // getAllDocs,
    getDoc,
    // deleteDoc,
    uploadCV,
    uploadDoc
}