const express = require('express');
const EmployedController = require("../controllers/employed");

const api = express.Router();

api.get("/employed-data/:idUser/:enterprise_id", EmployedController.employedData);
api.post("/employed", EmployedController.getEmployees);
api.put("/employed-priv", EmployedController.changePrivToEmployed);

module.exports = api;