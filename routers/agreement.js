const express = require('express');
const AgreementController = require("../controllers/agreement");

const api = express.Router();

api.get("/agreement", AgreementController.getAgreements);

module.exports = api;