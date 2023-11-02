const express = require('express');
const ProfessorController = require("../controllers/professor");

const api = express.Router();

api.put("/professor", ProfessorController.updateProfessor);
api.post("/coordinator/students", ProfessorController.getStudentsProfessor);
api.get("/coordinator/supervisors/:specialty", ProfessorController.getSupervisors);
api.get("/coordinator/professors/:specialty", ProfessorController.getProfessors);
api.post("/coordinator/students/registration", ProfessorController.registration);
api.delete("/coordinator/students/registration", ProfessorController.noRegistration);
api.put("/professor/assignSupervisor", ProfessorController.assignSupervisor);
api.put("/professor/assignScore", ProfessorController.assignScore);

module.exports = api;