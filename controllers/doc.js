const mysql = require('mysql');
const {MYSQL_CREDENTIALS} = require("../config")
const { sqlAsync } = require('../utils/async');
const { nowTime } = require('../utils/general-functions');

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

// async function uploadDocs(req, res) {
//     const code = req.params.code;
//     const isStudent = Number(req.params.isStudent);
//     const files = req.files;

//     const connection = mysql.createConnection(MYSQL_CREDENTIALS);
//     connection.connect(err => {
//         if (err) throw err;
//     });
    
//     if(files && Object.keys(files).length !== 0) {
//         try {
//             for (const doc in files) {
//                 const objDoc = files[doc];
//                 const docPathName = objDoc.path.split("/")[2];
//                 const docOriginalName = objDoc.originalFilename;
//                 const horaSubida = new Date().getTime()
//                 const sqlQuery = `INSERT INTO Documento(nombre, ruta, delAlumno, activo, codigo, horaSubida) 
//                     VALUES('${docOriginalName}', '${docPathName}', ${isStudent}, 1, '${code}', ${horaSubida})`;
//                 await sqlAsync(sqlQuery, connection)
//             }

//             res.status(200).send({
//                 success: true,
//                 message: "Archivos insertados correctamente!"
//             })
//         } catch(e){
//             console.log("ERORRRR:", e)
//             res.status(505).send({ 
//                 success: false,
//                 message: "Error en el servidor " + e.message
//             })
//         }

//     } else {
//         res.status(505).send({
//             success: false,
//             message: "No se han enviado archivos!"
//         })
//     }
//     connection.end();
// }

// function getAllDocs(req, res) {
//     const connection = mysql.createConnection(MYSQL_CREDENTIALS);
//     const code = req.params.code;
//     const isStudent = Number(req.params.isStudent);
//     const sqlQuery = `SELECT * FROM Documento WHERE codigo='${code}' AND delAlumno=${isStudent} AND activo=1;`;
//     connection.connect(err => {
//         if (err) throw err;
//     });
//     connection.query(sqlQuery, (err, result) => {
//         if (err) {
//             console.log(err)
//             res.status(505).send({
//                 success: false,
//                 message: "Error al tratar de acceder a la BD."
//             })
//         }
        
//         res.status(200).send({
//             success: true,
//             result
//         })
//     });

//     connection.end();
// }

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
    // uploadDocs,
    // getAllDocs,
    getDoc,
    // deleteDoc,
    uploadCV
}