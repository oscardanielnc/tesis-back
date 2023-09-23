const express = require('express');
const ProfessorController = require("../controllers/professor");

const api = express.Router();

api.put("/professor", ProfessorController.updateProfessor);

module.exports = api;