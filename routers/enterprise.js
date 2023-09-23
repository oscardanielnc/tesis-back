const express = require('express');
const EnterpriseController = require("../controllers/enterprise");

const api = express.Router();

api.get("/enterprise-data/:idUser", EnterpriseController.enterpriseData);
api.get("/enterprise-exist/:ruc", EnterpriseController.enterpriseExist);
api.post("/enterprises", EnterpriseController.getEnterprises);
api.put("/enterprise", EnterpriseController.updateEnterprise);

module.exports = api;