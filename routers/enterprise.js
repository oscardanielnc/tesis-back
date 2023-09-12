const express = require('express');
const EnterpriseController = require("../controllers/enterprise");

const api = express.Router();

api.get("/enterprise-data/:idUser", EnterpriseController.enterpriseData);
api.get("/enterprise-exist/:ruc", EnterpriseController.enterpriseExist);

module.exports = api;