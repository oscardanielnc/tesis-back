const express = require('express');
const AgreementController = require("../controllers/agreement");

const api = express.Router();

api.post("/agreement", AgreementController.getAgreements);
api.get("/agreement-state/:code/:iam", AgreementController.getAgreementState);
api.put("/agreement-sign", AgreementController.signAgreement);
api.put("/agreement-observation", AgreementController.observationAgreement);

module.exports = api;