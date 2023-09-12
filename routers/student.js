const express = require('express');
const StudentController = require("../controllers/student");

const api = express.Router();

api.get("/student-data/:idUser", StudentController.studentData);
api.post("/students", StudentController.getStudents);
api.put("/student-contract", StudentController.contractStudent);

module.exports = api;