const express = require('express');
const DocController = require("../controllers/doc");
const multipart = require("connect-multiparty");

const md_upload_docs = multipart({uploadDir: "./uploads/docs"})

const api = express.Router();

// api.get("/docs/:code/:isStudent", DocController.getAllDocs);
// api.delete("/doc/:idDoc", DocController.deleteDoc);
// api.put("/docs/:code/:isStudent", [md_upload_docs], DocController.uploadDocs);
api.get("/doc/:filePath/:fileName", DocController.getDoc);
api.put("/doc/cv/:id", [md_upload_docs], DocController.uploadCV);
api.put("/doc/cycle", [md_upload_docs], DocController.uploadDocCycle);
api.put("/doc/deliver", [md_upload_docs], DocController.uploadMyDeliver);
api.put("/doc/black-list", [md_upload_docs], DocController.uploadBlackList);
api.put("/doc/agreement/:id/:employed", [md_upload_docs], DocController.uploadAgreement);

module.exports = api;