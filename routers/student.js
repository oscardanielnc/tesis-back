const express = require('express');
const StudentController = require("../controllers/student");

const api = express.Router();

api.get("/student-data/:idUser", StudentController.studentData);

module.exports = api;