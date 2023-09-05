const express = require('express');
const EmployedController = require("../controllers/employed");

const api = express.Router();

api.get("/employed-data/:idUser", EmployedController.employedData);
api.get("/employed", EmployedController.getEmployees);

module.exports = api;