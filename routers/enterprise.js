const express = require('express');
const EnterpriseController = require("../controllers/enterprise");

const api = express.Router();

api.get("/enterprise-data/:idUser", EnterpriseController.enterpriseData);
api.get("/enterprise-exist/:ruc", EnterpriseController.enterpriseExist);
api.get("/enterprise-signed/:idEnterprise/:idUser", EnterpriseController.getAlredySigned);
api.get("/enterprise-bl/:id", EnterpriseController.getEnterpriseBlackList);
api.get("/enterprise-opinion/:id", EnterpriseController.getEnterpriseOpinion);
api.post("/enterprises-opinions", EnterpriseController.getEnterprisesOpinions);
api.post("/enterprises", EnterpriseController.getEnterprises);
api.post("/enterprises-bl", EnterpriseController.getEnterprisesBL);
api.put("/enterprise", EnterpriseController.updateEnterprise);

module.exports = api;