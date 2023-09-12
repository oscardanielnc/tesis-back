const express = require('express');
const AgreementController = require("../controllers/agreement");

const api = express.Router();

api.post("/agreement", AgreementController.getAgreements);
api.get("/agreement-state/:code", AgreementController.getAgreementState);

module.exports = api;